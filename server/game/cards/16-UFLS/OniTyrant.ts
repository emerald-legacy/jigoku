import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityContext } from '../../AbilityContext.js';
import type { Event } from '../../Events/Event.js';

const oniTyrantCost = function () {
    return {
        canPay: function () {
            return true;
        },
        resolve: function (context: AbilityContext, result: { cancelled?: boolean }) {
            let creatures = context.player.outsideTheGameCards;
            creatures = creatures.filter((card: DrawCard) => (card.printedCost ?? 0) <= 2 && context.game.actions.putIntoConflict().canAffect(card, context));
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a creature to summon',
                source: context.source,
                cards: creatures,
                choices: ['Cancel'],
                cardHandler: (card: DrawCard) => {
                    context.costs.oniTyrantCostCreature = card;
                },
                handlers: [
                    () => {
                        context.costs.oniTyrantCostCreature = undefined;
                        result.cancelled = true;
                        return true;
                    }
                ]
            });
        },
        payEvent: function (context: AbilityContext): Event | Event[] {
            if(context.costs.oniTyrantCostCreature) {
                const oni = context.costs.oniTyrantCostCreature as DrawCard;
                const copy = new (oni.constructor as typeof DrawCard)(context.player, oni.cardData);
                context.game.allCards.push(copy);
                context.costs.oniTyrantCostCreature = copy;

                const action = context.game.actions.handler({ handler: () => true }); //this is a do-nothing event since the cost isn't really a cost
                return action.getEvent(context.player, context);
            }
            return [];
        },
        promptsPlayer: true
    };
};

class OniTyrant extends DrawCard {
    static id = 'oni-tyrant';

    setupCardAbilities() {
        this.action({
            title: 'Summon a Shadowlands Creature',
            cost: [
                AbilityDsl.costs.payHonor(1),
                oniTyrantCost()
            ],
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.putIntoConflict(context => ({
                target: context.costs.oniTyrantCostCreature || context.player.outsideTheGameCards[1]
            })),
            effect: 'summon a{2} {1} from the depths of the Shadowlands!',
            effectArgs: context => {
                const creature = context.costs.oniTyrantCostCreature as DrawCard;
                var testStr = creature.name;
                var vowelRegex = '^[aieouAIEOU].*';
                var matched = testStr.match(vowelRegex);
                return [
                    creature,
                    matched ? 'n' : ''
                ];
            }
        });
    }
}


export default OniTyrant;
