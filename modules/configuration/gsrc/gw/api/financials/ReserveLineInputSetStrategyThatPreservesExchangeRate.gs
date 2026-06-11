package gw.api.financials
uses gw.lang.Export
uses java.lang.Deprecated
/**
 * An abstract ReserveLineInputSetStrategy implementation that restores the
 * TransToReservingExchangeRate on the transaction being edited to its
 * previously saved value whenever the transaction's reserving currency is
 * changed in the UI back to its previously saved reserving currency, either by
 * selecting a reserve line with that reserving currency or by selecting that
 * reserving currency explicitly for a new reserve line, as long as the
 * transaction currency also matches the previously saved transaction currency.
 *
 * <p>NOTE: If the transaction is itself newly created, and therefore has no
 * previously saved exchange rate, this strategy simply does nothing. The
 * default behavior whenever the reserving currency on a transaction changes is
 * to get the appropriate market rate.
 */
@Export
abstract class ReserveLineInputSetStrategyThatPreservesExchangeRate extends ReserveLineInputSetStrategy {

  var _originalTransToReservingExchangeRate : ExchangeRate
  var _originalTransToReservingExchangeRateInUse : TransToReservingExchangeRateInUse

  /**
   * @deprecated This method has been deprecated in favor of the new FXRate functionality, provided via the IFXRatePlugin
   * implementation. You can keep using it if you have set the 'UseDeprecatedExchangeRates' property to true, and are
   * continuing to use the legacy exchange rate implementation provided in older versions of ClaimCenter. If you are
   * migrating to use the new FXRate implementation, please replace all custom usages of this method with
   * {@code #construct(entity.ExchangeRate, entity.TransToReservingExchangeRateInUse)} or
   * {@code #construct(entity.TransToReservingExchangeRateInUse)}
   */
  @Deprecated
  internal construct(originalTransToReservingExchangeRate : ExchangeRate) {
    _originalTransToReservingExchangeRate = originalTransToReservingExchangeRate
  }

  internal construct(originalTransToReservingExchangeRateInUse : TransToReservingExchangeRateInUse) {
    _originalTransToReservingExchangeRateInUse = originalTransToReservingExchangeRateInUse
  }

  internal construct(check: Check) {
    this(check.TransToReservingExchangeRateInUse)
    if (check.UsingDeprecatedExchangeRates) {
      _originalTransToReservingExchangeRate = check.TransToReservingExchangeRate
    }
  }

  construct() {
  }
  override function afterReservingCurrencyChange(transaction : Transaction) {
    super.afterReservingCurrencyChange(transaction)
    // If the Transaction is being set to a RL with same Reserving Currency as that of the original
    // exchange rate -and- the Transaction currency hasn't changed...
    if (_originalTransToReservingExchangeRateInUse != null
        and transaction.ReservingCurrency == _originalTransToReservingExchangeRateInUse.ToCurrency
        and transaction.Currency == _originalTransToReservingExchangeRateInUse.FromCurrency) {
      // ...then, restore the original TransToReservingExchangeRateInUse
      transaction.populateTransToReservingExchangeRateInUseFromExistingRecord(_originalTransToReservingExchangeRateInUse)
    } else if (_originalTransToReservingExchangeRate != null
        and transaction.ReservingCurrency.equals(_originalTransToReservingExchangeRate.PriceCurrency)
        and transaction.Currency.equals(_originalTransToReservingExchangeRate.BaseCurrency)) {
      // ...then, restore the original TransToReservingCurrencyExchangeRate
      transaction.TransToReservingExchangeRate = _originalTransToReservingExchangeRate
    }
  }
}