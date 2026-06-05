import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type Player from '../../Player.js';
import type { CardData } from '../../types/CardData.js';
import type { Event } from '../../Events/Event.js';
import type { Cost } from '../../costs/Cost.js';

const accursedSummoningCost = function (): Cost {
    return {
        getActionName(_context: AbilityContext) {
            return 'accursedSummoningCost';
        },
        getCostMessage: function (_context: AbilityContext) {
            return ['losing {0} honor'];
        },
        canPay: function (context: AbilityContext) {
            return context.game.actions.loseHonor().canAffect(context.player, context);
        },
        resolve: function (context: AbilityContext, result: { cancelled?: boolean }) {
            let creatures = context.player.outsideTheGameCards;
            creatures = creatures.filter((card: DrawCard) => context.game.actions.putIntoConflict().canAffect(card, context));

            const creaturesByCost: DrawCard[][] = [[], [], [], [], []];
            creatures.forEach((creature: DrawCard) => {
                creaturesByCost[creature.printedCost ?? 0].push(creature);
            });
            context.costs.accursedSummoningCostCreature = undefined;
            result.cancelled = false;
            const promptForCost = () => context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a fate cost',
                source: context.source,
                choices: ['1', '2', '3', '4', 'All', 'Cancel'],
                handlers: [
                    () => {
                        promptForCards(creaturesByCost[1]);
                    },
                    () => {
                        promptForCards(creaturesByCost[2]);
                    },
                    () => {
                        promptForCards(creaturesByCost[3]);
                    },
                    () => {
                        promptForCards(creaturesByCost[4]);
                    },
                    () => {
                        promptForCards(creatures);
                    },
                    () => {
                        context.costs.accursedSummoningCostCreature = undefined;
                        result.cancelled = true;
                        return true;
                    }
                ]
            });

            const promptForCards = (creatures: DrawCard[]) => context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a creature to summon',
                source: context.source,
                cards: creatures,
                choices: ['Back', 'Cancel'],
                cardHandler: (card: DrawCard) => {
                    context.costs.accursedSummoningCostCreature = card;
                    context.costs.accursedSummoningCost = card.printedCost;
                },
                handlers: [
                    () => {
                        promptForCost();
                        return true;
                    },
                    () => {
                        context.costs.accursedSummoningCostCreature = undefined;
                        result.cancelled = true;
                        return true;
                    }
                ]
            });

            promptForCost();
        },
        payEvent: function (context: AbilityContext) {
            if(context.costs.accursedSummoningCostCreature) {
                const oni = context.costs.accursedSummoningCostCreature as DrawCard;
                const copy = new (oni.constructor as new (owner: Player, cardData: CardData) => DrawCard)(context.player, oni.cardData);
                context.game.allCards.push(copy);
                context.costs.accursedSummoningCostCreature = copy;

                let events: Event[] = [];
                const honorAmount = context.costs.accursedSummoningCost as number;
                let honorAction = context.game.actions.loseHonor({ target: context.player, amount: honorAmount });
                events.push(honorAction.getEvent(context.player, context));
                return events;
            }
            return [];
        },
        promptsPlayer: true
    };
};

class AccursedSummoning extends DrawCard {
    static id = 'accursed-summoning';

    setupCardAbilities() {
        this.action({
            title: 'Summon a Shadowlands Creature',
            cost: [accursedSummoningCost()],
            gameAction: AbilityDsl.actions.putIntoConflict(context => ({
                target: context.costs.accursedSummoningCostCreature || context.player.outsideTheGameCards[1]
            })),
            effect: 'summon a{2} {1} from the depths of the Shadowlands!',
            effectArgs: context => {
                const creature = context.costs.accursedSummoningCostCreature as DrawCard;
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

    isTemptationsMaho() {
        return true;
    }
}


export default AccursedSummoning;
