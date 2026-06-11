package gw.api.exchangerates

uses gw.api.database.IQueryBeanResult

/**
 * Custom search criteria to allow prescriptive exchange rates search criteria extension.
 */
@Export
final class CustomSearchCriteria extends DefaultSearchCriteria {

  /**
   * {@inheritDoc}
   */
  construct() {
  }

  /**
   * {@inheritDoc}
   */
  construct(ownerObject : FXExchangeRateSearchCriteria) {
    super(ownerObject)
  }

  /**
   * {@inheritDoc}
   */
  override function performSearch() : IQueryBeanResult {
    LOGGER.debug("Searching using CustomSearchCriteria");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CUSTOMIZATION EXAMPLE 1: Simple search customization case adding more restrictions to the existing internal query.
    /*
    uses gw.api.database.Relop
    ...

    owner.setSearchResultRestrictionsExtension(\fxRateRestriction, fxRateSetRestriction -> {
      fxRateRestriction.compare(FXExchangeRate#FieldA, Relop.Equals, owner.CustomSearchFieldA)
          ...
      fxRateSetRestriction.compare(FXExchangeRateSet#FieldZ, Relop.Equals, owner.CustomSearchFieldZ)
          ...
    });

    return owner.performSearch()
    */

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CUSTOMIZATION EXAMPLE 2: Complex search customization case creating a complete new custom query.
    /*
    uses gw.api.database.Query
    uses gw.api.database.Relop
    ...

    var fxRateRestriction = Query.make(FXExchangeRate)
     .compare(FXExchangeRate#BaseCurrency, Relop.Equals, owner.getBaseCurrency())
     .compare(...)
     ...

    var fxRateSetRestriction = fxRateRestriction.join(FXExchangeRate#FXExchangeRateSet)
     .compare(...)
     ...

    return fxRateRestriction.select()
    */

    return owner.performSearch();
  }
}
