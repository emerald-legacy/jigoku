import { msg } from '../../GameChat.js';
import { CardType, DuelType, Location, Players, Blocker } from '../../Constants.js';
import { menuPrompt, selectCard, triggerAbility } from '../../GameActions/GameActions.js';
import type { ResolvedAbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

export default class CunningNegotiator extends DrawCard {
    static id = 'cunning-negotiator';

    setupCardAbilities() {
        this.action('Political duel to resolve the attacked province\'s action ability')
            .condition((context) => context.game.isDuringConflict())
            .initiateDuel(() => ({
                type: DuelType.Political,
                opponentChoosesDuelTarget: true,
                chatText: () => msg`resolve the action ability of an attacked province`,
                gameAction: (duel) =>
                    menuPrompt((context) => ({
                        activePromptTitle: 'Do you want to trigger a province ability?',
                        choices: duel.winner ? ['Yes', 'No'] : [],
                        player: duel.winnerController === context.player ? Players.Self : Players.Opponent,
                        choiceHandler: (choice, displayMessage) => {
                            if(displayMessage) {
                                if(choice === 'Yes') {
                                    context.game.addMessage(msg`${context.player} chooses to trigger a province ability`);
                                } else {
                                    context.game.addMessage(msg`${context.player} chooses not to trigger a province ability`);
                                }
                            }
                            return {
                                cardCondition: (card: BaseCard) =>
                                    choice === 'Yes' ? card.isConflictProvince() : false
                            };
                        },
                        gameAction: selectCard((context) => ({
                            activePromptTitle: 'Choose an attacked province',
                            hidePromptIfSingleCard: true,
                            cardType: CardType.Province,
                            location: Location.Provinces,
                            subActionProperties: (card) => {
                                context.target = card;
                                return { target: card };
                            },
                            gameAction: triggerAbility((context: ResolvedAbilityContext<DrawCard, ProvinceCard>) => ({
                                player: duel.winnerController ?? context.source.controller,
                                ability: context.target.abilities.actions[0],
                                ignoredBlockers: [Blocker.LimitReached]
                            }))
                        }))
                    }))
            }));
    }
}
