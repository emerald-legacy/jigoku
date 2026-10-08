import type { Cost } from '../../costs/Cost.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { handler, putIntoConflict } from '../../GameActions/GameActions.js';
import type { Event } from '../../Events/Event.js';
import { createSummonedCopy, summonEffectArgs, summonEffectMessage } from '../summonCreature.js';

const oniTyrantCost = function (): Cost<{ oniTyrantCostCreature: DrawCard | undefined }> {
    return {
        canPay() {
            return true;
        },
        resolve(context, result) {
            let creatures = context.player.outsideTheGameCards;
            creatures = creatures.filter((card) => (card.printedCost ?? 0) <= 2 && putIntoConflict().canAffect(card, context));
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a creature to summon',
                source: context.source,
                cards: creatures,
                options: [
                    {
                        text: 'Cancel',
                        handler: () => {
                            context.costs.oniTyrantCostCreature = undefined;
                            result.cancelled = true;
                            return true;
                        }
                    }
                ],
                cardHandler: (card) => {
                    context.costs.oniTyrantCostCreature = card;
                }
            });
        },
        payEvent(context): Event | Event[] {
            if(context.costs.oniTyrantCostCreature) {
                context.costs.oniTyrantCostCreature = createSummonedCopy(context, context.costs.oniTyrantCostCreature);

                const action = handler({ handler: () => true }); //this is a do-nothing event since the cost isn't really a cost
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
        this.action('Summon a Shadowlands Creature')
            .cost(costs.payHonor(1))
            .cost(oniTyrantCost())
            .condition(context => context.source.isParticipating())
            .gameAction(putIntoConflict(context => ({
                target: context.costs.oniTyrantCostCreature || context.player.outsideTheGameCards[1]
            })))
            .chatText(summonEffectMessage, (context) => summonEffectArgs(context.costs.oniTyrantCostCreature));
    }
}


export default OniTyrant;
