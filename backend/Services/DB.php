<?php

namespace App\Services;

/**
 * @package DB
 * 
 * Class that interacts with the MySQL database using a fluent query builder
 * 
 * @author Peter Munene <munenenjega@gmail.com>
 */
final class DB {
    private static $instance;
    private $pdo;
    private $table;
    private $sql;
    private $bindings = [];

    private function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public static function getInstance($pdo) {
        if (self::$instance === null) {
            self::$instance = new self($pdo);
        }
        return self::$instance;
    }

    /**
     * Initialize a query for a specific table
     *
     * @param string $table The name of the table
     * @return DB
     */
    public static function table(string $table) {
        $instance = self::$instance ?? self::getInstance(null);
        $instance->table = $table;
        $instance->sql = '';
        $instance->bindings = [];
        return $instance;
    }

    /**
     * Run a raw SQL query
     *
     * @param string $sql The SQL query
     * @param array $bindings Optional query bindings
     * @return array|bool Results for SELECT or true for UPDATE/DELETE
     * @throws \Exception If query fails
     */
    public function raw(string $sql, array $bindings = []) {
        try {
            $statement = $this->pdo->prepare($sql);
            $statement->execute($bindings);
            $results = $statement->fetchAll(\PDO::FETCH_OBJ);

            if ($this->isUpdateOrDeleteQuery($sql) && empty($results)) {
                return true;
            }
            return $results;
        } catch (\Exception $e) {
            throw new \Exception("Raw query error: " . $e->getMessage());
        }
    }

    private function runQuery() {
        try {
            $statement = $this->pdo->prepare($this->sql);
            $statement->execute($this->bindings);

            // dd($this->getDebugFullQuery($this->sql, $this->bindings));

            $results = $statement->fetchAll(\PDO::FETCH_OBJ);

            if ($this->isUpdateOrDeleteQuery($this->sql) && empty($results)) {
                return true;
            }
            return $results;
        } catch (\Exception $e) {
            //add query debug info
            throw new \Exception("Query error: " . $e->getMessage()
                . " :QUERY:" . $this->getDebugFullQuery($this->sql, $this->bindings));
        }
    }

    public function get(array $cols = []) {
        if (!$this->sql || empty($this->table)) {
            throw new \Exception("No table specified for query");
        }
        $results = $this->runQuery();
        //use php to filter the results
        if ($results === true || empty($cols) || $cols[0] === '*') {
            return $results;
        } else {
            return array_map(fn($item) => array_intersect_key((array)$item, array_flip($cols)), $results);
        }
    }

    /**
     * Select all records from the table
     *
     * @return array
     */
    public function selectAll() {
        $this->sql = "SELECT * FROM {$this->table} ORDER BY `created_at` DESC";
        return $this->runQuery();
    }

    /**
     * Select specific columns
     *
     * @param array $values Columns to select
     * @return array
     */
    public function select(array $values) {
        $columns = implode(',', $values);
        $this->sql = "SELECT {$columns} FROM {$this->table}";
        return $this->runQuery();
    }

    /**
     * Select records where ID matches
     *
     * @param mixed $value ID value
     * @return array
     */
    public function selectAllWhereID($value) {
        $this->sql = "SELECT * FROM {$this->table} WHERE `id` = :id ORDER BY `created_at` DESC";
        $this->bindings = ['id' => $value];
        return $this->runQuery();
    }

    /**
     * Select records with a where condition
     *
     * @param string $column Column name
     * @param mixed $value Value to match
     * @param string $condition Operator (default: =)
     * @return array
     */
    public function selectAllWhere(string $column, $value, string $condition = '=') {
        $this->sql = "SELECT * FROM {$this->table} WHERE `{$column}` {$condition} :value ORDER BY `created_at` DESC";
        $this->bindings = ['value' => $value];
        return $this->runQuery();
    }

    /**
     * Select all records with multiple where conditions
     *
     * @param string $column Column name
     * @param mixed $value Value to match
     * @param string $condition Operator (default: =)
     * @return this
     */
    public function where(array $conditions, string $condition = '='): DB {
        $this->sql = "SELECT * FROM {$this->table} WHERE ";
        $this->bindings = [];
        foreach ($conditions as $column => $value) {
            if (is_null($value) || $value === '') {
                continue; // Skip null values
            }
            $param = $column . '_ci'; // Suffix param for clarity
            //only use LOWER for string values
            if (is_string($value)) {
                $this->sql .= "`". strtolower($column) ."` {$condition} LOWER(:{$param}) AND ";
            }elseif (is_numeric($value)) {
                $this->sql .= "`{$column}` {$condition} :{$param} AND ";
            } else {
                throw new \Exception("Unsupported value type for column {$column}" );
            }
            // Use LOWER() for both column and parameter
            $this->bindings[$param] = trim($value);
        }
        $this->sql = rtrim($this->sql, " AND ");
        $this->sql .= ' ORDER BY `created_at` DESC';

        return $this;
    }

    /**
     * Select specific columns with multiple where conditions
     *
     * @param array $values Columns to select
     * @param array $conditions Array of [column, value] pairs
     * @return array
     */
    public function selectWhere(array $values, array $condition) {
        $columns = implode(',', $values);
        list($column, $value) = $condition;
        $this->sql = "SELECT {$columns} FROM {$this->table} WHERE `{$column}` = :value";
        $this->bindings = ['value' => $value];
        return $this->runQuery();
    }

    /**
     * Update records
     *
     * @param array $dataToUpdate Key-value pairs to update
     * @param string $where Column for WHERE clause
     * @param mixed $isValue Value for WHERE clause
     * @return bool
     */
    public function update(array $dataToUpdate, string $where, $isValue) {
        $setParts = [];
        $bindings = [];
        foreach ($dataToUpdate as $key => $value) {
            $setParts[] = "`{$key}` = :{$key}";
            $bindings[$key] = $value;
        }
        $setClause = implode(', ', $setParts);
        $bindings['whereValue'] = $isValue;
        $this->sql = "UPDATE {$this->table} SET {$setClause} WHERE `{$where}` = :whereValue";
        $this->bindings = $bindings;
        return $this->runQuery();
    }

    /**
     * Delete records
     *
     * @param string $where Column for WHERE clause
     * @param mixed $isValue Value for WHERE clause
     * @return bool
     */
    public function delete(string $where, $isValue) {
        $this->sql = "DELETE FROM {$this->table} WHERE `{$where}` = :value";
        $this->bindings = ['value' => $isValue];
        return $this->runQuery();
    }

    /**
     * Insert a new record
     *
     * @param array $parameters Key-value pairs to insert
     * @return void
     */
    public function insert(array $parameters) {
        $columns = implode(', ', array_keys($parameters));
        $placeholders = ':' . implode(', :', array_keys($parameters));
        $this->sql = "INSERT INTO {$this->table} ({$columns}) VALUES ({$placeholders})";
        $this->bindings = $parameters;
        try {
            $statement = $this->pdo->prepare($this->sql);
            $statement->execute($this->bindings);
        } catch (\Exception $e) {
            throw new \Exception("Insert error: " . $e->getMessage());
        }
    }

    /**
     * Join two tables
     *
     * @param string $table2 Second table
     * @param string $fk Foreign key
     * @param string $pk Primary key
     * @return array
     */
    public function join(string $table2, string $fk, string $pk) {
        $this->sql = "SELECT * FROM `{$this->table}` INNER JOIN `{$table2}` ON {$this->table}.{$fk} = {$table2}.{$pk}";
        return $this->runQuery();
    }

    /**
     * Count records with a condition
     *
     * @param array $condition [column, value]
     * @return array
     */
    public function countWhere(array $condition) {
        list($column, $value) = $condition;
        $this->sql = "SELECT COUNT(*) AS count FROM {$this->table} WHERE `{$column}` = :value";
        $this->bindings = ['value' => $value];
        return $this->runQuery();
    }
    public function count() {
        $this->sql = "SELECT COUNT(*) AS count FROM {$this->table}";
        return $this->runQuery();
    }

    /**
     * Check if query is UPDATE or DELETE
     *
     * @param string $sql SQL query
     * @return bool
     */
    private function isUpdateOrDeleteQuery(string $sql): bool {
        return stripos($sql, 'update') !== false || stripos($sql, 'delete') !== false;
    }

    static public function getDebugFullQuery($query, $params = []) {
        if (is_array($params) && count($params)) {

            $search = [];
            $replace = [];

            foreach ($params as $k => $p) {
                $pos = strpos($query, ":{$k}");
                if ($pos !== false) {
                    $query = substr($query, 0, $pos) . "%!-!{$k}!-!%" . substr($query, $pos + strlen($k) + 1);
                } else {
                    $pos = strpos($query, "?");
                    if ($pos !== false) {
                        $query = substr($query, 0, $pos) . "%!-!{$k}!-!%" . substr($query, $pos + 1);
                    } else {
                        break;
                    }
                }

                $search[] = "%!-!{$k}!-!%";

                // Wrap value in single quotes (NO escaping)
                // Optionally keep \n/\r escaped if for debug readability
                $safeParam = str_replace(["\r", "\n"], ["\\r", "\\n"], $p);
                $replace[] = "'" . $safeParam . "'";
            }

            if (count($search)) {
                $query = str_replace($search, $replace, $query);
            }
        }

        return $query; // Do NOT apply stripslashes or addslashes
    }
}
