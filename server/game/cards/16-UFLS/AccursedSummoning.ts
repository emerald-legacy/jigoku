import DrawCard from '../../DrawCard.js';
import { loseHonor, putIntoConflict } from '../../GameActions/GameActions.js';
import type { Event } from '../../Events/Event.js';
import type { Cost } from '../../costs/Cost.js';
import { createSummonedCopy, summonEffectArgs, summonEffectMessage } from '../summonCreature.js';

const accursedSummoningCost = function (): Cost<{ accursedSummoningCostCreature: DrawCard | undefined; accursedSummoningCost: number | null }> {
    return {
        getActionName(_context) {
            return 'accursedSummoningCost';
        },
        getCostMessage(_context) {
            return ['losing {0} honor'];
        },
        canPay(context) {
            return loseHonor().canAffect(context.player, context);
        },
        resolve(context, result) {
            let creatures = context.player.outsideTheGameCards;
            creatures = creatures.filter((card) => putIntoConflict().canAffect(card, context));

            const creaturesByCost: DrawCard[][] = [[], [], [], [], []];
            creatures.forEach((creature) => {
                creaturesByCost[creature.printedCost ?? 0].push(creature);
            });
            context.costs.accursedSummoningCostCreature = undefined;
            result.cancelled = false;
            const promptForCost = () => context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a fate cost',
                source: context.source,
                options: [
                    ...[1, 2, 3, 4].map((cost) => ({
                        text: cost.toString(),
                        handler: () => promptForCards(creaturesByCost[cost])
                    })),
                    {
                        text: 'All',
                        handler: () => {
                            promptForCards(creatures);
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: () => {
                            context.costs.accursedSummoningCostCreature = undefined;
                            result.cancelled = true;
                            return true;
                        }
                    }
                ]
            });

            const promptForCards = (creatures: DrawCard[]) => context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a creature to summon',
                source: context.source,
                cards: creatures,
                options: [
                    {
                        text: 'Back',
                        handler: () => {
                            promptForCost();
                            return true;
                        }
                    },
                    {
                        text: 'Cancel',
                        handler: () => {
                            context.costs.accursedSummoningCostCreature = undefined;
                            result.cancelled = true;
                            return true;
                        }
                    }
                ],
                cardHandler: (card) => {
                    context.costs.accursedSummoningCostCreature = card;
                    context.costs.accursedSummoningCost = card.printedCost;
                }
            });

            promptForCost();
        },
        payEvent(context) {
            if(context.costs.accursedSummoningCostCreature) {
                context.costs.accursedSummoningCostCreature = createSummonedCopy(context, context.costs.accursedSummoningCostCreature);

                const events: Event[] = [];
                const honorAmount = context.costs.accursedSummoningCost ?? 0;
                const honorAction = loseHonor({ target: context.player, amount: honorAmount });
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
        this.action('Summon a Shadowlands Creature')
            .cost(accursedSummoningCost())
            .gameAction(putIntoConflict((context) => ({
                target: context.costs.accursedSummoningCostCreature || context.player.outsideTheGameCards[1]
            })))
            .chatText(summonEffectMessage, (context) => summonEffectArgs(context.costs.accursedSummoningCostCreature));
    }

    isTemptationsMaho() {
        return true;
    }
}


export default AccursedSummoning;
