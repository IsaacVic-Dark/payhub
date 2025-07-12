<?php

namespace App\Services;

final class Router {
    public static $prefix = '';
    
    public static $routes = [
        'GET' => [],
        'POST' => [],
        'PUT' => [],
        'PATCH' => [],
        'DELETE' => [],
    ];

    /**
     * Loads routes from a file
     * 
     * @param string $file Path to the route definition file
     * @return self Instance of Router class
     */
    public static function load(string $file) {
        $router = new static;
        require $file;
        return $router;
    }

    /**
     * Defines routes for a resource using a class name
     * 
     * @param string $uri URI of the resource
     * @param string $class Name of the controller class for the resource
     */
    public static function resource(string $uri, string $class) {
        // Index (GET)
        static::get($uri, "{$class}@index");
        // Create (POST)
        static::post($uri, "{$class}@create");
        // Show one (GET)
        static::get("$uri/{id}", "{$class}@show");
        // Update one (POST)
        static::put("$uri/update/{id}", "{$class}@update");
        // Delete one (POST)
        static::delete("$uri/delete/{id}", "{$class}@delete");
    }

    /**
     * Magic method to handle dynamic HTTP method calls (get, post, put, etc.)
     * 
     * @param string $method The HTTP method (e.g., get, post)
     * @param array $arguments Arguments passed to the method ([uri, controller])
     */
    public static function __callStatic(string $method, array $arguments) {
        $httpMethod = strtoupper($method);

        // Check if the HTTP method is supported
        if (!array_key_exists($httpMethod, static::$routes)) {
            throw new \BadMethodCallException("HTTP method {$httpMethod} is not supported.");
        }

        // Extract URI and controller from arguments
        [$uri, $controller] = $arguments;

        // Transform URI for regex matching
        $uri = preg_replace('/{[^}]+}/', '(.+)', trim($uri, '/'));

        static::$routes[$httpMethod][$uri] = $controller;
    }
    /**
     * Calls a route based on uri and request type
     * 
     * @param string $uri URI of the request
     * @param string $requestType HTTP request method (e.g. GET, POST)
     * @return mixed Can return any type depending on the called route
     */
    public function direct(string $uri, string $requestType): mixed {
        $params = [];
        $matchedRoute = null;

        // regex routes
        foreach (static::$routes[$requestType] as $route => $controller) {
            if (preg_match("%^{$route}$%", $uri, $matches)) {
                $matchedRoute = $route;
                unset($matches[0]); // remove full match
                $params = array_values($matches);
                break;
            }
        }

        // no route matches
        if ($matchedRoute === null) {
            throw new \Exception("Route {$requestType} /{$uri} does not exist");
        }

        $controller = static::$routes[$requestType][$matchedRoute];

        if (is_callable($controller)) {
            return $controller(...$params);
        }

        if (is_array($controller)) {
            return $this->callAction($params, ...$controller);
        }

        // Controller@method)
        if (is_string($controller)) {
            [$class, $method] = explode('@', $controller, 2);
            if (empty($class) || empty($method)) {
                throw new \Exception("Invalid controller format: {$controller}");
            }
            return $this->callAction($params, $class, $method);
        }

        throw new \Exception("Invalid controller type for route {$requestType} /{$uri}");
    }
    /**
     * Calls a controller action
     * 
     * @param array $params Route parameters as an array
     * @param string $controller Controller class name
     * @param string $action Action method name within the controller
     * @return mixed Can return any type depending on the controller action
     */
    protected function callAction(array $params, string $controller, string $action): mixed {
        if (strpos($controller, "\\") === false) {
            $controller = "App\\Controllers\\{$controller}";
        }

        if (!class_exists($controller)) {
            trigger_error("Class {$controller} does not exist!", E_USER_ERROR);
        }

        $controller = new $controller;

        if (!method_exists($controller, $action)) {
            trigger_error("Method {$action} does not exist on the " . get_class($controller) . " class", E_USER_ERROR);
        }

        return $controller->$action(...$params);
    }
}
