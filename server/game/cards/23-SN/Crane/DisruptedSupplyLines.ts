import type { AbilityContext } from '../../../AbilityContext.js';
import type { Cost } from '../../../costs/Cost.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { CardType, EventName, Location, Players } from '../../../Constants.js';
import { Result } from '../../../costs/Cost.js';
import DrawCard from '../../../DrawCard.js';
import { EventPayload } from '../../../Events/EventPayloads.js';
import Player from '../../../Player.js';
import { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

const resourcesAvailable = (context: AbilityContext) => {
    let fateAvailable = false;
    if(context.game.actions.loseFate().canAffect(context.player, context)) {
        fateAvailable = true;
    }

    const eligibleCharacters = context.player.cardsInPlay.filter(
        (card: DrawCard) => card.getType() === CardType.Character &&
            context.game.actions.dishonor().canAffect(card, context)
    );
    const freeCharacters = eligibleCharacters.filter((card: DrawCard) => card.hasSomeTrait('scout', 'shinobi'));

    return { fateAvailable, eligibleCharacters, freeCharacters };
};

const disruptedSupplyLinesCost = function (): Cost<{ disruptedSupplyLinesCostFatePaid: boolean; disruptedSupplyLinesCostDishonoredCharacter: DrawCard | undefined }> {
    return {
        getCostMessage(context) {
            return ['dishonoring {1}{2}',
                [context.costs.disruptedSupplyLinesCostDishonoredCharacter,
                    context.costs.disruptedSupplyLinesCostFatePaid ? ' and paying 1 fate' : '']
            ];
        },
        getActionName(_context) {
            return 'disruptedSupplyLinesCost';
        },
        canPay: function (context) {
            const { fateAvailable, eligibleCharacters, freeCharacters } = resourcesAvailable(context);
            return freeCharacters.length > 0 || (fateAvailable && eligibleCharacters.length > 0);
        },
        resolve: function (context, results: Result) {
            const { fateAvailable, eligibleCharacters, freeCharacters } = resourcesAvailable(context);
            context.costs.disruptedSupplyLinesCostFatePaid = false;
            context.costs.disruptedSupplyLinesCostDishonoredCharacter = undefined;
            results.cancelled = false;

            let cards = freeCharacters;
            if(fateAvailable) {
                cards = eligibleCharacters;
            }

            return context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isDrawCard() && cards.includes(card),
                context: context,
                onSelect: (player: Player, card: BaseCard) => {
                    if(card.isDrawCard()) {
                        context.costs.disruptedSupplyLinesCostFatePaid = !freeCharacters.includes(card);
                        context.costs.disruptedSupplyLinesCostDishonoredCharacter = card;
                    }
                    return true;
                },
                onCancel: () => {
                    results.cancelled = true;
                    return true;
                }
            });
        },
        payEvent: function (context) {
            const events = [];
            if(context.costs.disruptedSupplyLinesCostFatePaid) {
                const loseFateaction = context.game.actions.loseFate({ amount: 1, target: context.player });
                events.push(loseFateaction.getEvent(context.player, context));
            }

            const dishonorAction = context.game.actions.dishonor({ target: context.costs.disruptedSupplyLinesCostDishonoredCharacter });
            events.push(dishonorAction.getEvent(context.costs.disruptedSupplyLinesCostDishonoredCharacter, context));

            return events;
        },
        promptsPlayer: true
    };
};

export default class DisruptedSupplyLines extends DrawCard {
    static id = 'disrupted-supply-lines';

    setupCardAbilities() {
        this.interrupt('Remove attachment from game')
            .when({
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => (
                    !!event.parent && event.parent.getType() === CardType.Character &&
                    event.context?.player === context.player.opponent
                )
            })
            .cost(disruptedSupplyLinesCost())
            .select('target', {
                player: Players.Opponent
            }, {
                'Give your opponent 1 fate': AbilityDsl.actions.takeFate(),
                'Remove attachment from the game': AbilityDsl.actions.cancel((context) => ({
                    target: context.source,
                    replacementGameAction: AbilityDsl.actions.removeFromGame((context: TriggeredAbilityContext<DrawCard, DrawCard>) => ({ target: context.event.card, location: Location.Any }))
                }))
            })
            .effect('{1}{2}{3}', context => context.select === 'Give your opponent 1 fate' ?
                ['take 1 fate from ', context.player.opponent, ''] :
                ['remove ', context.event.card, ' from the game']);
    }
}
