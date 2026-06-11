package gw.api.financials

uses gw.lang.Export

uses java.lang.Deprecated

/**
 * A ReserveLineInputSetStrategy implementation appropriate for recovery
 * recode screens, disallowing the user from changing the reserving currency
 * when recoding a recovery.
 */
@Export
class ReserveLineInputSetStrategyForRecoveryRecode extends ReserveLineInputSetStrategyForRecovery {

  /**
   * @deprecated This method has been deprecated in favor of the new FXRate functionality, provided via the IFXRatePlugin
   * implementation. You can keep using it if you have set the 'UseDeprecatedExchangeRates' property to true, and are
   * continuing to use the legacy exchange rate implementation provided in older versions of ClaimCenter. If you are
   * migrating to use the new FXRate implementation, please replace all custom usages of this method with
   * {@code #construct(entity.TransToReservingExchangeRateInUse)}
   */
  @Deprecated
  internal construct(originalTransToReservingExchangeRate : ExchangeRate) {
    super(originalTransToReservingExchangeRate)
  }

  internal construct(originalTransToReservingExchangeRateInUse : TransToReservingExchangeRateInUse) {
    super(originalTransToReservingExchangeRateInUse)
  }

  /**
   * @deprecated This method has been deprecated in favor of the new FXRate functionality, provided via the IFXRatePlugin
   * implementation. You can keep using it if you have set the 'UseDeprecatedExchangeRates' property to true, and are
   * continuing to use the legacy exchange rate implementation provided in older versions of ClaimCenter. If you are
   * migrating to use the new FXRate implementation, please replace all custom usages of this method with
   * {@code #newHelper(Recovery}
   */
  @Deprecated
  static function newHelper(originalTransToReservingExchangeRate : ExchangeRate) : ReserveLineInputSetHelper {
    var strategy = new ReserveLineInputSetStrategyForRecoveryRecode(originalTransToReservingExchangeRate)
    return new ReserveLineInputSetHelper(strategy)
  }

  static function newHelper(originalRecovery : Recovery) : ReserveLineInputSetHelper {
    var strategy = originalRecovery.isUsingDeprecatedExchangeRates()
        ? new ReserveLineInputSetStrategyForRecoveryRecode(originalRecovery.TransToReservingExchangeRate)
        : new ReserveLineInputSetStrategyForRecoveryRecode(originalRecovery.TransToReservingExchangeRateInUse)

    return new ReserveLineInputSetHelper(strategy)
  }

  override function restrictReservingCurrency(transaction: Transaction) : Currency {
    return transaction.ReservingCurrency
  }

}