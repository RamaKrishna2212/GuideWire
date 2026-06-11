package gw.plugin.billing.bc5080.demo

uses gw.api.database.Query
uses gw.plugin.billing.BillingAccountInfo
uses gw.plugin.billing.BillingProducerCodeInfo
uses gw.plugin.billing.BillingSystemPluginBase

@Export
class DemoBillingSystemPlugin extends BillingSystemPluginBase {

  protected override function addClaimPaymentCharges(check : Check, messagePublicID : String) : String {
    LOGGER.debug("Add claim #(${check.Claim.ClaimNumber}) payment for check account info: " +
        check.FirstPayee.BillingAccountNumber + "/" + check.FirstPayee.BillingAccountName)
    return null
  }

  protected override function reverseClaimPaymentCharges(check : Check, messagePublicID : String) : String[]{
    LOGGER.debug("Reverse claim #(${check.Claim.ClaimNumber}) payment for check account info: " +
        check.FirstPayee.BillingAccountNumber + "/" + check.FirstPayee.BillingAccountName)
    return null
  }

  protected override function reverseAndAddClaimPaymentCharges(check : Check, messagePublicID : String) : String {
    LOGGER.debug("Reverse from claim #(${check.Claim.ClaimNumber}) and add claim #(${check.TransferredToCheck.Claim.ClaimNumber}) payment for check account info: " +
        check.FirstPayee.BillingAccountNumber + "/" + check.FirstPayee.BillingAccountName)
    return null
  }

  protected override function addClaimRecoveryCharges(recovery : Recovery, messagePublicID : String) : String {
    LOGGER.debug("Add claim #(${recovery.Claim.ClaimNumber}) recovery for billing account info: " +
        recovery.BillingAccountNumber + "/" + recovery.BillingAccountName)
    return null
  }

  protected override function reverseClaimRecoveryCharges(recovery : Recovery, messagePublicID : String) : String[] {
    LOGGER.debug("Reverse claim #(${recovery.Claim.ClaimNumber}) recovery for billing account info: " +
        recovery.BillingAccountNumber + "/" + recovery.BillingAccountName)
    return null
  }

  override function getPrimaryPayerAccountsForContact(addressBookUID : String) : BillingAccountInfo[] {
    try {
      return performGetPrimaryPayerAccountsForContact(addressBookUID)
    } catch (e : Exception) {
      LOGGER.error("Get primary payer accounts for contact failed on addressBookUID: " + addressBookUID, e)
      throw e
    }
  }

  protected override function performGetPrimaryPayerAccountsForContact(addressBookUID : String) : BillingAccountInfo[] {
    if (addressBookUID == null) {
      return {}
    }
    var claimContacts = Query.make(ClaimContact)
        .join(ClaimContact#Contact)
        .compare(Contact#AddressBookUID, Equals, addressBookUID)
        .select().toList()

    var currencies = List.of(Currency.TC_EUR, Currency.TC_USD)
    return claimContacts
        .where(\claimContact -> claimContact.Claim.Policy.AccountNumber != null)
        .map(\claimContact -> new BillingAccountInfo(claimContact.Claim.Policy.AccountNumber, claimContact.Contact.DisplayName, currencies))
        .toTypedArray()
  }

  protected override function performDoAllProducerCodesHaveAgencyBillPlanInternal(billingProducerCodeInfos : List<BillingProducerCodeInfo>) : boolean {
    return false
  }
}