package gw.currency

uses gw.api.util.CurrencyUtil
uses gw.api.financials.CurrencyAmount

/**
 * The overloaded versions of the sum() method had to be moved to separate enhancements due to the way block type erasure
 * works (all blocks with the same arity have the same erasure).  Splitting the methods up into different enhancements
 * prevents them from conflicting, since they become part of different Java classes.
 *
 *  Copyright 2012 Guidewire Software, Inc.
 */
enhancement GWArrayCurrencyAmountSumEnhancement<T> : T[] {
  /**
   * Return the average of the values of the target of the mapper argument,
   *   which must all be of the default currency.
   *
   * Delete this method if you are running Multi-Currency mode!
   */
  reified function average( select:block(elt:T):CurrencyAmount ) : CurrencyAmount {
    return this.average( CurrencyUtil.getDefaultCurrency(), select )
  }
}