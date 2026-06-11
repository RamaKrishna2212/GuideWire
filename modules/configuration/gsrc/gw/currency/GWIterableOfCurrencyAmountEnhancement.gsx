package gw.currency

uses gw.api.financials.CurrencyAmount

/**
 *  Copyright 2012 Guidewire Software, Inc.
 */
@Export
enhancement GWIterableOfCurrencyAmountEnhancement : Iterable<CurrencyAmount> {

  /**
   * Return the average of the CurrencyAmount elements,
   *   which must all be of the default currency.
   *
   * Delete this method if you are running Multi-Currency mode!
   */
  function average() : CurrencyAmount {
    return this.average( \ amt -> amt )
  }
}