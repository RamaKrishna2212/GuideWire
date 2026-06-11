package gw.util

uses gw.api.address.CCAddressOwner
uses gw.api.locale.DisplayKey

@Export
class AddressLabelUtil {
  
  // addressOwner must be passed in to update with PostOnChanges
  static function getAddresses(addressOwner : CCAddressOwner) : Address[] {
    // return address for FixedPropertyIncident which has null for Claim property
    // else return First which gets address only from Claim
    return addressOwner.Claim == null
      ? addressOwner.Addresses
      : addressOwner.Claim.AddressesAndSourceMap.First
  }
  
  static function maybePrefixLabel(addressOwner : CCAddressOwner, selectedEntry : Object, shouldPrefixAddress : boolean) : String {
    var result = RangeInputUtil.formatLabel(addressOwner.getOrCreateNewAddress(), selectedEntry)

    return shouldPrefixAddress && !isNewLabel(result)
      ? getAddressPrefix(addressOwner, selectedEntry as Address, result)
      : result
  }
  
  private static function getAddressPrefix(addressOwner : CCAddressOwner, address : Address, result : String) : String {
    // bean is entity with FK pointing to this address; Claim, Policy Location, or Contact on policy with certain role
    var bean = addressOwner.Claim == null
        ? null
        : addressOwner.Claim.AddressesAndSourceMap.Second.get(address)

    if (bean typeis Claim) {
      return DisplayKey.get("Web.Address.LabelPrefix.LossLocation", result)
    }
    if (bean typeis PolicyLocation) {
      return DisplayKey.get("Web.Address.LabelPrefix.PolicyLocation", result)
    }
    if (bean typeis Contact) {
      return DisplayKey.get("Web.Address.LabelPrefix.Contact", result)
    }
    return result
  }
  
  // for "New ..." option label
  private static function isNewLabel(result : String) : boolean {
    return result == DisplayKey.get("Java.NameValueView.New")
  }

}