<?php


/**
 * dd
 * 
 * dump the results & die with debug information
 * 
 * @param mixed $data variable to be dumped
 * 
 * @return void
 */
function dd($var) {
    // Get backtrace information
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
    $caller = $backtrace[0] ?? [];
    
    $filename = $caller['file'] ?? 'Unknown file';
    $line = $caller['line'] ?? 'Unknown line';
    
    // Get just the filename without full path for cleaner output
    $shortFilename = basename($filename);
    
    if (php_sapi_name() === 'cli') {
        // CLI output with debug info
        echo "\n" . str_repeat('=', 50) . "\n";
        echo "DD DEBUG OUTPUT\n";
        echo "File: {$shortFilename}\n";
        echo "Line: {$line}\n";
        echo "Full Path: {$filename}\n";
        echo str_repeat('=', 50) . "\n\n";
        
        var_dump($var);
        
        // Add backtrace for CLI
        echo "\n" . str_repeat('-', 30) . "\n";
        echo "BACKTRACE:\n";
        echo str_repeat('-', 30) . "\n";
        debug_print_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        
        die();
    }

    // Web output with enhanced styling
    ini_set("highlight.keyword", "#a50000; font-weight: bolder");
    ini_set("highlight.string", "#5825b6; font-weight: lighter;");

    ob_start();
    highlight_string("<?php\n" . var_export($var, true) . "?>");
    $highlighted_output = ob_get_clean();
    $highlighted_output = str_replace(["&lt;?php", "?&gt;"], '', $highlighted_output);

       
    echo '<div style="font-family: console, monospace; ">';
    echo '<div style="background:rgba(233, 236, 239, 0.5); padding: 10px; margin-bottom: 15px; border-radius: 4px; ">';
    echo  'dumped in: ' . htmlspecialchars($shortFilename) . ':' . htmlspecialchars($line) . '<small> (' . htmlspecialchars($filename) . ')</small><br>';
    echo '</div>';
    
    // Variable dump
    echo '<div style="background: white; padding: 15px; border-radius: 4px; border: 1px dashed rgba(205, 207, 209, 0.87);">';
    echo $highlighted_output;
    echo '</div>';
    
    // Backtrace section
    echo '<div style="margin-top: 15px; background: #fff3cd; padding: 15px; border-radius: 4px; ">';
    echo '<strong style="color:rgba(133, 101, 4, 0.53); margin-bottom: 10px; display: block;">Call Stack:</strong>';
    echo '<div style="background: white; padding: 10px; border-radius: 4px; font-size: 12px; max-height: 200px; overflow-y: auto;">';
    
    // Custom backtrace formatting for web
    $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
    foreach ($trace as $i => $call) {
        if ($i === 0) continue; // Skip the dd() call itself
        
        $file = isset($call['file']) ? basename($call['file']) : 'Unknown';
        $line = $call['line'] ?? '?';
        $function = $call['function'] ?? 'Unknown';
        $class = isset($call['class']) ? $call['class'] . $call['type'] : '';
        
        echo '<div style="margin-bottom: 5px; padding: 5px; background: #f8f9fa;">';
        echo "<strong>#{$i}:</strong> {$class}{$function}() ";
        echo "<span style='color: #6c757d;'>in {$file}:{$line}</span>";
        echo '</div>';
    }
    
    echo '</div>';
    echo '</div>';
    echo '</div>';
    
    die();
}
function login()  {
    
}

function logout()  {
    
}

function check_auth()  {
    
}