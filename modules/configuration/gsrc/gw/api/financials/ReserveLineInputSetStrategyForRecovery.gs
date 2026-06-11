package gw.api.financials

uses java.lang.Deprecated

/**
 * A ReserveLineInputSetStrategy implementation appropriate for recovery-related
 * screens, providing common on-change behavior when editing recoveries. There
 * is no filtering of reserve lines or exposures when editing recoveries, so the
 * various allow...() methods are not overridden.
 */
@Export
class ReserveLineInputSetStrategyForRecovery extends ReserveLineInputSetStrategyThatPreservesExchangeRate {

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
    super(originalTransToReservingExchangeRate)
  }

  internal construct(originalTransToReservingExchangeRateInUse : TransToReservingExchangeRateInUse) {
    super(originalTransToReservingExchangeRateInUse)
  }

  internal construct(){
    super()
  }

  override function afterReserveLineChange(transaction : Transaction) {
    FinancialsUtil.ensureRecoveryHasOneLineItem(transaction as Recovery)
  }

  /**
   * @deprecated This method has been deprecated in favor of the new FXRate functionality, provided via the IFXRatePlugin
   * implementation. You can keep using it if you have set the 'UseDeprecatedExchangeRates' property to true, and are
   * continuing to use the legacy exchange rate implementation provided in older versions of ClaimCenter. If you are
   * migrating to use the new FXRate implementation, please replace all custom usages of this method with
   * {@code #newHelper(entity.Recovery)}
   */
  @Deprecated
  static function newHelper(originalTransToReservingExchangeRate : ExchangeRate) : ReserveLineInputSetHelper {
    var strategy = new ReserveLineInputSetStrategyForRecovery(originalTransToReservingExchangeRate)
    return new ReserveLineInputSetHelper(strategy)
  }

  static function newHelper(originalRecovery : Recovery) : ReserveLineInputSetHelper {
    var strategy = originalRecovery.isUsingDeprecatedExchangeRates()
        ? new ReserveLineInputSetStrategyForRecovery(originalRecovery.TransToReservingExchangeRate)
        : new ReserveLineInputSetStrategyForRecovery(originalRecovery.TransToReservingExchangeRateInUse)

    return new ReserveLineInputSetHelper(strategy)
  }
}
