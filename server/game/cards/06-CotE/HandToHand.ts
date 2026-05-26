import DrawCard from '../../drawcard.js';
import { CardTypes, Players, TargetModes } from '../../Constants.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities(ability: any) {
        this.action({
            title: 'Discard an attachment',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card: any) => card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            effect: 'discard {0} from play',
            then: context => {
                if(!context) {
                    return {};
                }
                const ctx = context;
                return {
                    target: {
                        player: ctx.player.opponent ? Players.Opponent : Players.Self,
                        mode: TargetModes.Select,
                        activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                        choices: {
                            'Yes': ability.actions.resolveAbility({
                                ability: ctx.ability,
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
