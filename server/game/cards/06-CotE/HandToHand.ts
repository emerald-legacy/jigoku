import type AbilityDsl from '../../abilitydsl.js';
import type CardAbility from '../../CardAbility.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Discard an attachment',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardType.Attachment,
                cardCondition: (card: any) => card.parent && card.parent.type === CardType.Character && card.parent.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            effect: 'discard {0} from play',
            then: context => {
                const ctx = context;
                return {
                    target: {
                        player: ctx.player.opponent ? Players.Opponent : Players.Self,
                        mode: TargetMode.Select,
                        activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                        choices: {
                            'Yes': ability.actions.resolveAbility({
                                ability: ctx.ability as CardAbility,
                                player: ctx.player.opponent ?? ctx.player,
                                subResolution: true,
                                choosingPlayerOverride: ctx.choosingPlayerOverride ?? undefined
                            }),
                            'No': () => true
                        }
                    },
                    message: '{3} chooses {4}to resolve {1}\'s ability again',
                    messageArgs: (thenContext: any) => [ctx.player.opponent ?? ctx.player, thenContext.select === 'No' ? 'not ' : '']
                };
            }
        });
    }
}


export default HandToHand;
