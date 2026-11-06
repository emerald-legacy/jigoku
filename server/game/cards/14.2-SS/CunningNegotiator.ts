import { msg } from '../../GameChat.js';
import { DuelType, Blocker } from '../../Constants.js';
import { chooseAction, optional, selectAttackedProvince, triggerAbility } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type { CardAbility } from '../../CardAbility.js';

export default class CunningNegotiator extends DrawCard {
    static id = 'cunning-negotiator';

    override setupCardAbilities() {
        this.action('Political duel to resolve the attacked province\'s action ability')
            .condition((context) => context.game.isDuringConflict())
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                chatText: () => msg`resolve the action ability of an attacked province`,
                gameAction: (duel) =>
                    optional({
                        activePromptTitle: 'Do you want to trigger a province ability?',
                        player: duel.winnerController,
                        acceptMessage: (_context, chooser) => msg`${chooser} chooses to trigger a province ability`,
                        declineMessage: (_context, chooser) => msg`${chooser} chooses not to trigger a province ability`,
                        gameAction: selectAttackedProvince({
                            player: duel.winnerController,
                            gameAction: (province) => {
                                const trigger = (ability: CardAbility) => triggerAbility({
                                    player: duel.winnerController,
                                    ability,
                                    ignoredBlockers: [Blocker.LimitReached]
                                });
                                const actions = province.abilities.actions;
                                if(actions.length < 2) {
                                    return trigger(actions[0]);
                                }
                                return chooseAction({
                                    activePromptTitle: 'Choose an ability to trigger',
                                    player: duel.winnerController,
                                    choices: Object.fromEntries(actions.map((ability) => [ability.title, trigger(ability)]))
                                });
                            }
                        })
                    })
            }));
    }
}
