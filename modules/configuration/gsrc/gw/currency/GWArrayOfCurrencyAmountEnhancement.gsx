package gw.currency

uses gw.api.financials.CurrencyAmount

/**
 *  Copyright 2012 Guidewire Software, Inc.
 */
@Export
enhancement GWArrayOfCurrencyAmountEnhancement : CurrencyAmount[] {

  /**
   * Return the average of the CurrencyAmount contents,
   *   which must all be of the default currency.
   *
   * Delete this method if you are running Multi-Currency mode!
   */
  function average() : CurrencyAmount {
    return this.toList().average( \ i -> i )
  }
}