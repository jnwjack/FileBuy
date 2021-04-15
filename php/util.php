<?php

  $feeRate = 0.08;
  $baseFee = 0.60;

  function priceWithFee(float $price) {
    global $feeRate, $baseFee;

    return round($price + $baseFee + $price * $feeRate, 2);
  }

?>