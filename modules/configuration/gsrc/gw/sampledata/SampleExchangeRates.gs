package gw.sampledata

uses gw.api.util.CCCurrencyUtil
uses gw.pl.persistence.core.Bundle

@Export
class SampleExchangeRates extends SampleDataBase {
  var _normalizeRates : boolean

  internal construct() {
    this(new SampleDataCache())
    _normalizeRates = false
  }

  construct(inCache : SampleDataCache) {
    super(inCache)
    _normalizeRates = true
  }

  /**
   * Returns the description based on the loader selected.
   *
   * @return Loader description.
   */
  override property get Description() : String {
    if (CCCurrencyUtil.getUseDeprecatedExchangeRates()) {
      return "ExchangeRateSet and ExchangeRate"
    }
    return "ExchangeRateSet and ExchangeRate; FXExchangeRateSet and FXExchangeRate"
  }

  /**
   * Tests loading sample exchange rates data with a given bundle and default effective date.
   *
   * @param bundle The bundle to associate the rates entities with.
   */
  override function testSampleData(bundle : Bundle) {
    new ExchangeRatesLoader()
        .withBundle(bundle)
        .withEffectiveDate(BaseDate ?: Date.CurrentDate)
        .withExpirationDate(null)
        .withForcedReload(false)
        .withNormalizedRates(_normalizeRates)
        .load()
  }

  /**
   * Reloads the sample exchange rates data, removing all previous data from the database.
   */
  static function reloadSampleExchangeRates() {
    new ExchangeRatesLoader()
        .withEffectiveDate(Date.CurrentDate)
        .withExpirationDate(null)
        .withForcedReload(true)
        .withNormalizedRates(true)
        .load()
  }
}
