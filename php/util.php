<?php

  $feeRate = 0.08;
  $baseFee = 0.60;

  $maxFileSize = 4000000;

  $maxPrice = 1000;

  function priceWithFee(float $price) {
    global $feeRate, $baseFee;

    return round($price + $baseFee + $price * $feeRate, 2);
  }

  function fileTooLarge(string $file) {
    global $maxFileSize;
    
    return strlen(base64_decode($file)) > $maxFileSize;
  }

  function priceTooLarge(float $price) {
    global $maxPrice;

    return $price > $maxPrice;
  }

?>