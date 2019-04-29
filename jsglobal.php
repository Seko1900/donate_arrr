<?php
// Set application type
header('Content-type: application/javascript');

// Set variables
$str_ouptput;

// Get content of real javascript files
$str_output = file_get_contents('https://seko1900.github.io/donate_arrr/jquery.min.js');
$str_output .= file_get_contents('https://seko1900.github.io/donate_arrr/jquery-qrcode.min.js');
$str_output .= file_get_contents('https://seko1900.github.io/donate_arrr/donate_arrr.js');

// Remove single line comments
$str_output = preg_replace('#//.*#', '', $str_output);

// Remove line breaks and indents
$str_output = preg_replace('#\n|\n\r|\r|\t#', '', $str_output);

// Send fake js
echo $str_output;
?>
