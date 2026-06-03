import type { AbilityContext } from '../../../AbilityContext.js';
import CardAbility from '../../../CardAbility.js';
import { CardType, ConflictType, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class TheVoidOfWar extends DrawCard {
    static id = 'the-void-of-war';

    setupCardAbilities() {
        this.action({
            title: 'Each player bows an opponent character until refused',
            condition: (context) => context.game.isDuringConflict(ConflictType.Military),
            target: {
                controller: Players.Opponent,
                player: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            effect: 'bow {0}.',
            then: (context) => {
                const ctx = context;
                return {
                    target: {
                        player: ctx.player.opponent ? Players.Opponent : Players.Self,
                        mode: TargetMode.Select,
                        activePromptTitle: 'Resolve The Void of War\'s ability again?',
                        choices: {
                            Yes: AbilityDsl.actions.resolveAbility({
                                ability: ctx.ability as CardAbility,
                                player: ctx.player.opponent ?? ctx.player,
                                subResolution: true,
                                choosingPlayerOverride: ctx.choosingPlayerOverride ?? undefined
                            }),
                            No: () => true
                        }
                    },
                    message: '{3} chooses {4}to resolve {1}\'s ability again',
                    messageArgs: (thenContext: AbilityContext) => [
                        ctx.player.opponent ?? ctx.player,
                        thenContext.select === 'No' ? 'not ' : ''
                    ]
                };
            }
        });
    }
}
