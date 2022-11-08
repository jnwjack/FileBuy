<?php
  require_once('database_request.php');

  // Old rate
  //$feeRate = 0.08;
  //$baseFee = 1.00;

  // Current rate (free)
  $feeRate = 0.0;
  $baseFee = 0.0;

  $maxFileSize = 4000000;

  $maxPrice = 1000;

  $maxPostings = 5;

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

  function tooManyPostings(PDO $db, string $email) {
    global $maxPostings;

    // x is a dummy variable required by mysql syntax
    $statement = $db->prepare('
          SELECT COUNT(*) FROM 
          (
            SELECT NULL FROM listings WHERE email=:emailone 
            UNION ALL 
            SELECT NULL FROM commissions WHERE email=:emailtwo
          )x');
    $statement->bindValue(':emailone', $email, PDO::PARAM_STR);
    $statement->bindValue(':emailtwo', $email, PDO::PARAM_STR);
    $successful = $statement->execute();
    if(!$successful) {
      return true;
    }
    $numPostings = $statement->fetchColumn();
    return $numPostings >= $maxPostings;
  }

?>
