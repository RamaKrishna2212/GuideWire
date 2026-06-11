package gw.plugin.policy.refresh.matcher

/**
 * Entity matcher for addresses.
 */
@Export
class AddressMatcher extends PolicyGraphMatcherBase<Address>
{
  /**
   * Attempts to match on the Address Book UID, or on equal
   * address fields. 
   */
  override function doEntitiesMatch(a1 : Address, a2 : Address) : boolean {
    if(areBothNotNull(a1.AddressBookUID, a2.AddressBookUID)) {
      return a1.AddressBookUID==a2.AddressBookUID
    }
    return doAddressFieldsMatch(a1, a2)
  }

  protected function doAddressFieldsMatch(a1:Address, a2:Address) : boolean {
    return areBothNullOrEqual(a1.AddressLine1, a2.AddressLine1) and
      areBothNullOrEqual(a1.AddressLine2, a2.AddressLine2) and
      areBothNullOrEqual(a1.AddressLine3, a2.AddressLine3) and
      areBothNullOrEqual(a1.City, a2.City) and
      areBothNullOrEqual(a1.County, a2.County) and
      areBothNullOrEqual(a1.State, a2.State) and
      areBothNullOrEqual(a1.Country, a2.Country) and
      areBothNullOrEqual(a1.PostalCode, a2.PostalCode) and
      areBothNullOrEqual(a1.ExtraField1, a2.ExtraField1) and
      areBothNullOrEqual(a1.ExtraField2, a2.ExtraField2) and
      areBothNullOrEqual(a1.ExtraField3, a2.ExtraField3) and
      areBothNullOrEqual(a1.ExtraField4, a2.ExtraField4) and
      areBothNullOrEqual(a1.ExtraField5, a2.ExtraField5) and
      areBothNullOrEqual(a1.ExtraField6, a2.ExtraField6) and
      areBothNullOrEqual(a1.ExtraField7, a2.ExtraField7) and
      areBothNullOrEqual(a1.ExtraField8, a2.ExtraField8) and
      areBothNullOrEqual(a1.ExtraField9, a2.ExtraField9) and
      areBothNullOrEqual(a1.ExtraField10, a2.ExtraField10)
  }
}