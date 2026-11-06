import { CharacterStatus, Location, TargetMode } from '../Constants.js';
import * as GameActions from '../GameActions/GameActions.js';
import { eraseSelectCardsProperties, SelectCardAction } from '../GameActions/SelectCardAction.js';
import type { ReturnToDeckProperties } from '../GameActions/ReturnToDeckAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { Cost, CostContext } from './Cost.js';
import { getSelectCost, type SelectCostResult, type TypedSelectCostProperties } from './costHelpers.js';
import type { CardTypes } from '../types/CardOfType.js';
import { GameActionCost } from './GameActionCost.js';
import { MetaActionCost } from './MetaActionCost.js';

/**
 * Cost that will bow the card that initiated the ability.
 */
export function bowSelf(): Cost {
    return new GameActionCost(GameActions.bow());
}
/** A cost is paid with what the player controls (RRG Cost): the parent only counts while it is theirs. */
function ownParent(context: AbilityContext) {
    const parent = context.source.parentCharacter;
    return parent && parent.controller === context.player ? parent : [];
}

/**
 * Cost that bows the character the source is attached to.
 */
export function bowParent(): Cost {
    return new GameActionCost(GameActions.bow((context) => ({ target: ownParent(context) })));
}

/**
 * Cost that bows a card the player chooses.
 */
export function bow<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'bow', Types, Mode>, Context> {
    return getSelectCost('bow', GameActions.bow(), properties, 'Select card to bow');
}

/**
 * Cost that moves a character the player chooses into the conflict.
 */
export function moveToConflict<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'moveToConflict', Types, Mode>, Context> {
    return getSelectCost('moveToConflict', GameActions.moveToConflict(), properties, 'Select card to move to the conflict');
}

/**
 * Cost that will sacrifice the card that initiated the ability.
 */
export function sacrificeSelf(): Cost {
    return new GameActionCost(GameActions.sacrifice());
}

/**
 * Cost that sacrifices a card the player chooses.
 */
export function sacrifice<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'sacrifice', Types, Mode>, Context> {
    return getSelectCost('sacrifice', GameActions.sacrifice(), properties, 'Select card to sacrifice');
}

/**
 * Cost that returns a card the player chooses to its owner's hand.
 */
export function returnToHand<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'returnToHand', Types, Mode>, Context> {
    return getSelectCost('returnToHand', GameActions.returnToHand(), properties, 'Select card to return to hand');
}

/**
 * Cost that returns a card the player chooses to its owner's deck.
 */
export function returnToDeck<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: ReturnToDeckProperties & TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'returnToDeck', Types, Mode>, Context> {
    return getSelectCost('returnToDeck', GameActions.returnToDeck(properties), properties, 'Select card to return to your deck');
}

/**
 * Cost that will return to hand the card that initiated the ability.
 */
export function returnSelfToHand(): Cost {
    return new GameActionCost(GameActions.returnToHand());
}

/**
 * Cost that shuffles a selected card into its owner's dynasty deck.
 */
export function shuffleIntoDeck<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'moveCard', Types, Mode>, Context> {
    return getSelectCost(
        'moveCard',
        GameActions.moveCard({ destination: Location.DynastyDeck, shuffle: true }),
        properties,
        'Select card to shuffle into deck'
    );
}

/**
 * Cost that discards the given cards.
 */
export function discardCardsOf(cardFunc: (context: AbilityContext) => DrawCard | DrawCard[] | undefined): Cost<{ discardCard: DrawCard[] }> {
    const action = GameActions.discardCard((context) => ({ target: cardFunc(context) }));
    return {
        getActionName: () => 'discardCard',
        canPay: (context) => action.hasLegalTarget(context),
        addEventsToArray: (events, context) => {
            const target = cardFunc(context);
            context.costs.discardCard = (Array.isArray(target) ? target : [target]).filter((card) => !!card);
            action.addEventsToArray(events, context);
        },
        getCostMessage: (context) => action.getCostMessage(context) ?? []
    };
}

/**
 * Cost that discards the source.
 */
export function discardSelf(): Cost {
    return new GameActionCost(GameActions.discardCard((context) => ({ target: context.source })));
}

/**
 * Cost that requires discarding a card to be selected by the player.
 */
export function discardCard<const Types extends CardTypes = undefined, const Mode extends TargetMode = TargetMode.Exactly, Context extends AbilityContext = AbilityContext>(
    properties?: TypedSelectCostProperties<Types, Mode, Context>
): Cost<SelectCostResult<'discardCard', Types, Mode>, Context> {
    return getSelectCost(
        'discardCard',
        GameActions.discardCard(),
        { location: Location.Hand, mode: TargetMode.Exactly, ...properties },
        (properties?.numCards ?? 0) > 1 ? `Select ${properties?.numCards} cards to discard` : 'Select card to discard'
    );
}

/**
 * Cost that removes a fate from the source.
 */
export function removeFateFromSelf(): Cost {
    return new GameActionCost(GameActions.removeFate());
}

/**
 * Cost that removes a fate from a card the player chooses.
 */
export function removeFate<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'removeFate', Types, Mode>, Context> {
    return getSelectCost('removeFate', GameActions.removeFate(), properties, 'Select character to discard a fate from');
}

/**
 * Cost that removes a fate from the character the source is attached to.
 */
export function removeFateFromParent(): Cost {
    return new GameActionCost(GameActions.removeFate((context) => ({ target: ownParent(context) })));
}

/**
 * Cost that requires removing a card selected by the player from the game.
 */
export function removeFromGame<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'removeFromGame', Types, Mode>, Context> {
    return getSelectCost('removeFromGame', GameActions.removeFromGame(), properties, 'Select card to remove from game');
}

/**
 * Cost that removes the source from the game.
 */
export function removeSelfFromGame(properties?: { location: Array<Location> }): Cost {
    return new GameActionCost(GameActions.removeFromGame(properties));
}

/**
 * Cost that will dishonor the character that initiated the ability
 */
export function dishonorSelf(): Cost {
    return new GameActionCost(GameActions.dishonor());
}

/**
 * Cost that requires dishonoring a card to be selected by the player
 */
export function dishonor<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties?: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'dishonor', Types, Mode>, Context> {
    return getSelectCost('dishonor', GameActions.dishonor(), properties, 'Select character to dishonor');
}

/**
 * Cost that requires tainting a card to be selected by the player
 */
export function taint<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'taint', Types, Mode>, Context> {
    return getSelectCost('taint', GameActions.taint(), properties, 'Select card to taint');
}

export function discardHonoredToken<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: Omit<TypedSelectCostProperties<Types, Mode, Context>, 'subActionProperties'>): Cost {
    return new MetaActionCost(
        new SelectCardAction(eraseSelectCardsProperties({
            gameAction: GameActions.discardStatusToken(),
            subActionProperties: (cards) => ({ target: (Array.isArray(cards) ? cards : [cards]).map((card) => card.getStatusToken(CharacterStatus.Honored)) }),
            ...properties
        })),
        'Select character to discard honored status token from'
    );
}

/**
 * Cost that discards the source's status token of the given status
 */
export function discardStatusTokenFromSelf(status: CharacterStatus): Cost {
    return new GameActionCost(GameActions.discardStatusToken((context) => ({
        target: context.source.getStatusToken(status) ?? []
    })));
}

/**
 * Cost that will break the province that initiated the ability
 */
export function breakSelf(): Cost {
    return new GameActionCost(GameActions.breakProvince());
}

/**
 * Cost that requires breaking a province selected by the player
 */
export function breakProvince<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'breakProvince', Types, Mode>, Context> {
    return getSelectCost('breakProvince', GameActions.breakProvince(), properties, 'Select a province to break');
}

/**
 * Cost that will put into play the card that initiated the ability
 */
export function putSelfIntoPlay(): Cost {
    return new GameActionCost(GameActions.putIntoPlay());
}

/**
 * Cost that reveals a card the player chooses.
 */
export function reveal<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(properties: TypedSelectCostProperties<Types, Mode, Context>): Cost<SelectCostResult<'reveal', Types, Mode>, Context> {
    return getSelectCost('reveal', GameActions.reveal(), properties, `Select a ${properties.cardType || 'card'} to reveal`);
}

/**
 * Cost that will reveal specific cards
 */
export function revealCardsOf<Card extends BaseCard>(cardFunc: (context: AbilityContext) => Card[]): Cost<{ reveal: Card[] }> {
    return new GameActionCost(GameActions.reveal((context) => ({ target: cardFunc(context) })));
}

/**
 * Cost that discards the Imperial Favor
 */
export function discardImperialFavor(): Cost {
    return new GameActionCost(GameActions.loseImperialFavor((context) => ({ target: context.player })));
}

type SwitchLocationContext = CostContext<{ switchLocation: DrawCard }, AbilityContext<DrawCard>>;

export function switchLocation(): Cost<{ switchLocation: DrawCard }> {
    return {
        promptsPlayer: false,
        canPay(context: AbilityContext<DrawCard>) {
            const canMoveHome = GameActions.sendHome().canAffect(context.source, context);
            const canMoveToConflict = GameActions.moveToConflict().canAffect(context.source, context);

            return canMoveHome || canMoveToConflict;
        },
        getActionName(_context) {
            return 'switchLocation';
        },
        getCostMessage(context: AbilityContext<DrawCard>) {
            if(!context.source.isParticipating()) {
                return ['moving {1} home', [context.source]];
            }
            return ['moving {1} to the conflict', [context.source]];
        },
        resolve(context: SwitchLocationContext, _result) {
            context.costs.switchLocation = context.source;
        },
        payEvent(context: SwitchLocationContext) {
            const action = context.source.isParticipating()
                ? GameActions.sendHome({ target: context.costs.switchLocation })
                : GameActions.moveToConflict({ target: context.costs.switchLocation });
            return action.getEvent(context.costs.switchLocation, context);
        }
    };
}

export function dishonorAndSacrifice<const Types extends CardTypes = undefined, const Mode extends TargetMode | undefined = undefined, Context extends AbilityContext = AbilityContext>(
    properties: TypedSelectCostProperties<Types, Mode, Context>
): Cost<SelectCostResult<'dishonorAndSacrifice', Types, Mode>, Context> {
    // a cost is paid in full or not at all, so the character must be able to take both
    const gameAction = GameActions.joint([
        GameActions.dishonor(),
        GameActions.sacrifice()
    ]);

    const actionCost = new MetaActionCost(
        new SelectCardAction(eraseSelectCardsProperties({ gameAction, ...properties })),
        'Choose a card to dishonor and sacrifice',
        'dishonorAndSacrifice'
    );
    actionCost.getCostMessage = (context: CostContext<{ dishonorAndSacrifice: BaseCard }>): MessageArgs => {
        return ['dishonoring and sacrificing {1}', [context.costs.dishonorAndSacrifice]];
    };

    return actionCost;
}
