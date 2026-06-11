package gw.api.claim

uses gw.api.locale.DisplayKey

/**
 * Helper for Vehicle Incident UI PCFs
 *   + Occupants: Driver and Passengers
 *   + Vehicle Incident Details
 */
@Export
class VehicleIncidentUIHelper {

  private var _vehicleIncident : VehicleIncident

  construct(vehicleIncident : VehicleIncident) {
    this._vehicleIncident = vehicleIncident
  }


  /**
   * @return list of people in the vehicle
   */
  property get VehicleOccupants() : ArrayList<Person> {

    var occupants = new ArrayList<Person>()

    var driver = this._vehicleIncident.driver
    if (driver != null) {
      occupants.add(driver)
    }

    occupants.addAll(this._vehicleIncident.passenger.toList())

    return occupants
  }

  /**
   * Based on the list of VehicleOccupants for this VehicleIncident, return the icon
   * @param occupant
   * @return Icon for this occupant which could be either Driver or Passenger
   */
  function getOccupantIcon(occupant: Person) : String {
    return _vehicleIncident.driver == occupant ? DriverIcon : PassengerIcon
  }

  /**
   * Based on the list of VehicleOccupants for this VehicleIncident, return the icon tooltip
   * @param occupant
   * @return Icon Tooltip for this occupant
   */
  function getOccupantIconTooltip(occupant: Person) : String {
    return _vehicleIncident.driver == occupant ? DriverIconTooltip : PassengerIconTooltip
  }

  /**
   * @param severity type for the injury
   * @return Icon for the type of the severity
   */
  function getOccupantSeverityIcon(severity: SeverityType) : String {
    return severity == SeverityType.TC_FATAL ? "fatality" : "injury"
  }

  /**
   * @param severity type for the injury
   * @return Icon tooltip for the type of the severity
   */
  function getOccupantSeverityIconTooltip(severity: SeverityType) : String {
    return severity ==  SeverityType.TC_FATAL ?
        DisplayKey.get("Web.NewLossDetailsScreen.VehicleIncidentIterator.Fatal.IconLabel")
        : DisplayKey.get("Web.NewLossDetailsScreen.VehicleIncidentIterator.Injured.IconLabel")
  }

  /**
   * @param occupant
   * @return role of the occupant in this VehicleIncident
   */
  function getOccupantRole(occupant: Person) : ContactRole {
    return _vehicleIncident.driver == occupant ? TC_DRIVER : TC_PASSENGER
  }

  property get DriverIcon() : String {
    return "driver"
  }

  property get DriverIconTooltip() : String {
    return DisplayKey.get("Web.NewLossDetailsScreen.VehicleIncidentIterator.Driver.IconLabel")
  }

  property get PassengerIcon() : String {
    return "passenger"
  }

  property get PassengerIconTooltip() : String {
    return DisplayKey.get("Web.NewLossDetailsScreen.VehicleIncidentIterator.Passenger.IconLabel")
  }

  // Helper methods used in VehicleIncidentDV.pcf (Vehicle Incident Details)

  /**
   * Check and update vehicleIncident fields when vehicle picker value is changed
   * @param vehicleIncident Vehicle incident read from and updated
   */
  public static function onVehiclePickerChange(vehicleIncident : VehicleIncident) {
    // VehicleIncident LossParty and VehicleType
    if (vehicleIncident.Claim.Policy.isPolicyVehicle(vehicleIncident.Vehicle)) {
      vehicleIncident.LossParty = LossPartyType.TC_INSURED
      vehicleIncident.VehicleType = VehicleType.TC_LISTED
    } else {
      vehicleIncident.LossParty = null
      vehicleIncident.VehicleType = null
    }
  }

  /**
   * Check and update vehicleIncident fields when driver picker is changed
   * @param vehicleIncident Vehicle incident read from and updated
   * @param claim associated Claim
   */
  public static function onDriverPickerChange(vehicleIncident : VehicleIncident, claim : Claim) {
    // VehicleIncident DriverRelation
    var originalDriveRelationValue = vehicleIncident.DriverRelation
    switch (vehicleIncident.driver as Contact) {
      case claim.Insured:
        vehicleIncident.DriverRelation = TC_SELF
        break
      case claim.reporter:
        vehicleIncident.DriverRelation = claim.ReportedByType
        break
      case claim.maincontact:
        vehicleIncident.DriverRelation = claim.MainContactType
        break
      default:
        vehicleIncident.DriverRelation = null
    }

    if (originalDriveRelationValue != vehicleIncident.DriverRelation) {
      onRelationToInsuredChange(vehicleIncident)
    }
  }

  /**
   * Check and update vehicleIncident fields when Relation to Insured field is changed
   * @param vehicleIncident Vehicle incident read from and updated
   */
  public static function onRelationToInsuredChange(vehicleIncident : VehicleIncident) {
    // OwnersPermission
    if (vehicleIncident.DriverRelation == PersonRelationType.TC_SELF) {
      vehicleIncident.OwnersPermission = true
    } else {
      vehicleIncident.OwnersPermission = null
    }

    // Owner Picker
    if (vehicleIncident.LossParty == LossPartyType.TC_THIRD_PARTY) {
      if (vehicleIncident.DriverRelation == PersonRelationType.TC_SELF) {
        vehicleIncident.incidentowner = vehicleIncident.driver
      } else {
        vehicleIncident.incidentowner = null
      }
    }
  }

}