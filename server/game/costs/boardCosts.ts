import { type CardType, CharacterStatus, Decks, Location, TargetMode } from '../Constants.js';
import * as GameActions from '../GameActions/GameActions.js';
import { ReturnToDeckProperties } from '../GameActions/ReturnToDeckAction.js';
import { SelectCardProperties } from '../GameActions/SelectCardAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type { Cost, CostContext } from './Cost.js';
import { getSelectCost, type SelectCostProperties, type SelectCostResult, type TypedSelectCostProperties } from './costHelpers.js';
import { GameActionCost } from './GameActionCost.js';
import { MetaActionCost } from './MetaActionCost.js';

/**
 * Cost that will bow the card that initiated the ability.
 */
export function bowSelf(): Cost {
    return new GameActionCost(GameActions.bow());
}
/**
 * Cost that will bow the card that the card that initiated the ability is attached to.
 */
export function bowParent(): Cost {
    return new GameActionCost(GameActions.bow((context) => ({ target: context.source.parentCharacter ?? [] })));
}

/**
 * Cost that requires bowing a card that matches the passed condition
 * predicate function.
 */
export function bow<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'bow', K, M>> {
    return getSelectCost('bow', GameActions.bow(), properties, 'Select card to bow');
}

/**
 * Cost that will send the target to the conflict.
 */
export function moveToConflict<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'moveToConflict', K, M>> {
    return getSelectCost('moveToConflict', GameActions.moveToConflict(), properties, 'Select card to move to the conflict');
}

/**
 * Cost that will sacrifice the card that initiated the ability.
 */
export function sacrificeSelf(): Cost {
    return new GameActionCost(GameActions.sacrifice());
}

/**
 * Cost that requires sacrificing a card that matches the passed condition
 * predicate function.
 */
export function sacrifice<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'sacrifice', K, M>> {
    return getSelectCost('sacrifice', GameActions.sacrifice(), properties, 'Select card to sacrifice');
}

/**
 * Cost that will return a selected card to hand which matches the passed
 * condition.
 */
export function returnToHand<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'returnToHand', K, M>> {
    return getSelectCost('returnToHand', GameActions.returnToHand(), properties, 'Select card to return to hand');
}

/**
 * Cost that will return a selected card to the appropriate deck which matches the passed
 * condition.
 */
export function returnToDeck<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: ReturnToDeckProperties & TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'returnToDeck', K, M>> {
    return getSelectCost('returnToDeck', GameActions.returnToDeck(properties), properties, 'Select card to return to your deck');
}

/**
 * Cost that will return to hand the card that initiated the ability.
 */
export function returnSelfToHand(): Cost {
    return new GameActionCost(GameActions.returnToHand());
}

/**
 * Cost that will shuffle a selected card into the relevant deck which matches the passed
 * condition.
 */
export function shuffleIntoDeck<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'move', K, M>> {
    return getSelectCost(
        'move',
        GameActions.moveCard({ destination: Location.DynastyDeck, shuffle: true }),
        properties,
        'Select card to shuffle into deck'
    );
}

/**
 * Cost that requires discarding a specific card.
 */
export function discardCardSpecific(cardFunc: (context: AbilityContext) => DrawCard | DrawCard[]): Cost {
    return new GameActionCost(GameActions.discardCard((context) => ({ target: cardFunc(context) })));
}

/**
 * Cost that requires discarding itself from hand.
 */
export function discardSelf(): Cost {
    return new GameActionCost(GameActions.discardCard((context) => ({ target: context.source })));
}

/**
 * Cost that requires discarding a card to be selected by the player.
 */
export function discardCard<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode = TargetMode.Exactly>(
    properties?: TypedSelectCostProperties<K, M>
): Cost<SelectCostResult<'discardCard', K, M>> {
    return getSelectCost(
        'discardCard',
        GameActions.discardCard(),
        { location: Location.Hand, mode: TargetMode.Exactly, ...properties },
        (properties?.numCards ?? 0) > 1 ? `Select ${properties?.numCards} cards to discard` : 'Select card to discard'
    );
}

export function discardTopCardsFromDeck(properties: { amount: number; deck: Decks }): Cost<{ discardTopCardsFromDeck: DrawCard[] }> {
    const getDeck =
        properties.deck === Decks.DynastyDeck
            ? (context: AbilityContext) => context.player.dynastyDeck
            : (context: AbilityContext) => context.player.conflictDeck;
    const destination =
        properties.deck === Decks.DynastyDeck ? Location.DynastyDiscardPile : Location.ConflictDiscardPile;
    return {
        getActionName: (_context) => 'discardTopCardsFromDeck',
        getCostMessage: (_context) => ['discarding {0}'],
        canPay: (context) => getDeck(context).length >= properties.amount,
        resolve: (context) => {
            context.costs.discardTopCardsFromDeck = getDeck(context).slice(0, properties.amount);
        },
        pay: (context) => {
            for(const card of context.costs.discardTopCardsFromDeck ?? []) {
                card.controller.moveCard(card, destination);
            }
        }
    };
}

/**
 * Cost that will discard a fate from the card
 */
export function removeFateFromSelf(): Cost {
    return new GameActionCost(GameActions.removeFate());
}

/**
 * Cost that will discard a fate from a selected card
 */
export function removeFate<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'removeFate', K, M>> {
    return getSelectCost('removeFate', GameActions.removeFate(), properties, 'Select character to discard a fate from');
}

/**
 * Cost that will discard a fate from the card's parent
 */
export function removeFateFromParent(): Cost {
    return new GameActionCost(GameActions.removeFate((context) => ({ target: context.source.parentCharacter ?? [] })));
}

/**
 * Cost that requires removing a card selected by the player from the game.
 */
export function removeFromGame<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'removeFromGame', K, M>> {
    return getSelectCost('removeFromGame', GameActions.removeFromGame(), properties, 'Select card to remove from game');
}

/**
 * Cost that requires removing a card selected by the player from the game.
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
export function dishonor<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties?: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'dishonor', K, M>> {
    return getSelectCost('dishonor', GameActions.dishonor(), properties, 'Select character to dishonor');
}

/**
 * Cost that requires tainting a card to be selected by the player
 */
export function taint<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'taint', K, M>> {
    return getSelectCost('taint', GameActions.taint(), properties, 'Select card to taint');
}

export function discardStatusToken(properties: Omit<SelectCardProperties, 'gameAction' | 'subActionProperties'>): Cost {
    return new MetaActionCost(
        GameActions.selectCard(
            Object.assign(
                {
                    gameAction: GameActions.discardStatusToken(),
                    subActionProperties: (card: DrawCard) => ({ target: card.getStatusToken(CharacterStatus.Honored) })
                },
                properties
            )
        ),
        'Select character to discard honored status token from'
    );
}

/**
 * Cost that will discard the status token on a card to be selected by the player
 */
export function discardStatusTokenFromSelf(): Cost {
    return new GameActionCost(GameActions.discardStatusToken());
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
export function breakProvince<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'break', K, M>> {
    return getSelectCost('break', GameActions.breakProvince(), properties, 'Select a province to break');
}

/**
 * Cost that will put into play the card that initiated the ability
 */
export function putSelfIntoPlay(): Cost {
    return new GameActionCost(GameActions.putIntoPlay());
}

/**
 * Cost that will prompt for a card
 */
export function selectedReveal<const K extends CardType | readonly CardType[] | undefined = undefined, const M extends TargetMode | undefined = undefined>(properties: TypedSelectCostProperties<K, M>): Cost<SelectCostResult<'reveal', K, M>> {
    return getSelectCost('reveal', GameActions.reveal(), properties, `Select a ${properties.cardType || 'card'} to reveal`);
}

/**
 * Cost that will reveal specific cards
 */
export function reveal<T extends BaseCard>(cardFunc: (context: AbilityContext) => T[]): Cost<{ reveal: T[] }> {
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
            const canMoveHome = context.game.actions.sendHome().canAffect(context.source, context);
            const canMoveToConflict = context.game.actions.moveToConflict().canAffect(context.source, context);

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
                ? context.game.actions.sendHome({ target: context.costs.switchLocation })
                : context.game.actions.moveToConflict({ target: context.costs.switchLocation });
            return action.getEvent(context.costs.switchLocation, context);
        }
    };
}

export function dishonorAndSacrifice(properties: SelectCostProperties): Cost<{ dishonorAndSacrifice: BaseCard }> {
    const gameAction = GameActions.multiple([
        GameActions.dishonor(),
        GameActions.sacrifice()
    ]);
    gameAction.name = 'dishonorAndSacrifice';

    const actionCost = new MetaActionCost(
        GameActions.selectCard(Object.assign({
            gameAction
        }, properties)),
        'Choose a card to dishonor and sacrifice'
    );

    actionCost.getActionName = () => 'dishonorAndSacrifice';
    actionCost.getCostMessage = (context: CostContext<{ dishonorAndSacrifice: BaseCard }>): MessageArgs => {
        return ['dishonoring and sacrificing {1}', [context.costs.dishonorAndSacrifice]];
    };

    return actionCost;
}
