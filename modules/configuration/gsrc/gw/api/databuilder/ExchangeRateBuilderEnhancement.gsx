package gw.api.databuilder

uses java.math.BigDecimal

@Export
enhancement ExchangeRateBuilderEnhancement : ExchangeRateBuilder {

  /**
   * Gets an ExchangeRateBuilder configured to create an ExchangeRate on a custom ExchangeRateSet with
   * an effective date of today and a name.
   *
   * @return a new ExchangeRateBuilder for a custom rate
   */
  static function getCustom(baseCurrency : Currency, priceCurrency : Currency, rate : BigDecimal) : ExchangeRateBuilder {
    return new ExchangeRateBuilder().withCustom(baseCurrency, priceCurrency, rate)
  }

  /**
   * Configure this builder to create an ExchangeRate on a custom ExchangeRateSet with an effective date of today and a name.
   *
   * @return this ExchangeRateBuilder
   */
  function withCustom(baseCurrency : Currency, priceCurrency : Currency, rate : BigDecimal) : ExchangeRateBuilder {
    return this
        .withBaseCurrency(baseCurrency)
        .withPriceCurrency(priceCurrency)
        .withRate(rate)
        .onExchangeRateSet(new ExchangeRateSetBuilder()
            .effectiveNow()
            .notMarketRates()
            .withName(baseCurrency + "-to-" + priceCurrency + " custom rate"))
  }

}
