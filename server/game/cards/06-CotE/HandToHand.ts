import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players, TargetMode } from '../../Constants.js';

class HandToHand extends DrawCard {
    static id = 'hand-to-hand';

    setupCardAbilities() {
        this.action('Discard an attachment')
            .condition(() => this.game.isDuringConflict('military'))
            .target('target', {
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isParticipating())
            }, AbilityDsl.actions.discardFromPlay())
            .effect('discard {0} from play')
            .then((ctx) => {
                return {
                    target: {
                        player: ctx.player.opponent ? Players.Opponent : Players.Self,
                        mode: TargetMode.Select,
                        activePromptTitle: 'Resolve Hand to Hand\'s ability again?',
                        choices: {
                            'Yes': AbilityDsl.actions.resolveAbility({
                                ability: ctx.ability,
                                player: ctx.player.opponent ?? ctx.player,
                                subResolution: true,
                                choosingPlayerOverride: ctx.choosingPlayerOverride ?? undefined
                            }),
                            'No': () => true
                        }
                    },
                    message: '{3} chooses {4}to resolve {1}\'s ability again',
                    messageArgs: (thenContext: AbilityContext) => [ctx.player.opponent ?? ctx.player, thenContext.select === 'No' ? 'not ' : '']
                };
            });
    }
}


export default HandToHand;
