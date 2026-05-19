import DrawCard from '../../drawcard.js';
import { CardTypes, Players, TargetModes } from '../../Constants.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: ability.actions.discardFromPlay()
            },
            effect: 'discard {0} from play',
            then: context => ({
                target: {
                    player: context.player.opponent ? Players.Opponent : Players.Self,
                    mode: TargetModes.Select,
                    activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                    choices: {
                        'Yes': ability.actions.resolveAbility({
                            ability: context.ability,
                            player: context.player.opponent ? context.player.opponent : context.player,
                            subResolution: true,
                            choosingPlayerOverride: context.choosingPlayerOverride
                        }),
                        'No': () => true
                    }
                },
                message: '{3} chooses {4}to resolve {1}\'s ability again',
                messageArgs: thenContext => [context.player.opponent ? context.player.opponent : context.player, thenContext.select === 'No' ? 'not ' : '']
            })
        });
    }
}


export default HandToHand;
