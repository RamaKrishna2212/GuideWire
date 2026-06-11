package gw.plugin.preupdate.impl

uses gw.plugin.preupdate.prioritized.PrioritizedPreUpdateHandler
uses gw.plugin.preupdate.prioritized.PrioritizedPreUpdateHandlerImpl

/**
 * Default implementation of the {@link gw.plugin.preupdate.IPreUpdateHandler} plug-in in ClaimCenter.
 * <p>
 * This plug-in is executed during every bundle commit, prior to the execution of PreUpdate Rules.
 * If new entities need to be created during the commit, they should be instantiated within this plug-in
 * to ensure that PreUpdate and Validation Rules are applied to those entities.
 * For more detailed information, please refer to the official documentation.
 * <p>
 * You can extend or modify this plugin implementation as needed, but it is important to call the superclass
 * implementation of <b>all</b> methods or replicate all the methods it invokes, in the exact same order,
 * to maintain proper system behavior.
 */
@Export
class CCPreUpdateHandlerPluginImpl extends CCPreupdateAbstractHandlerImpl {

  construct() {
    this(new PrioritizedPreUpdateHandlerImpl())
  }

  internal construct(prioritizedPreUpdateHandler : PrioritizedPreUpdateHandler) {
    super(prioritizedPreUpdateHandler)
  }
}
