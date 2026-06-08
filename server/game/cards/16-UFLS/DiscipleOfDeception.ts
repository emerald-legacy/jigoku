import { CardType, TargetMode } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { StatusToken } from '../../StatusToken.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class DiscipleOfDeception extends DrawCard {
    static id = 'disciple-of-deception';

    private eventRegistrar?: EventRegistrar;
    private tokensChanged?: StatusToken[];

    public setupCardAbilities() {
        this.tokensChanged = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished']);

        this.action({
            title: 'Treat a status token as a different token',
            condition: (context) => context.game.isDuringConflict(),
            effect: 'replace {1}\'s {2} with {3} until the end of the conflict',
            effectArgs: (context) => [
                (context.tokens.second as StatusToken[])[0].card as DrawCard,
                context.tokens.second,
                context.tokens.first
            ],
            targets: {
                first: {
                    activePromptTitle: 'Choose the status token to copy',
                    mode: TargetMode.Token,
                    cardType: CardType.Character
                },
                second: {
                    dependsOn: 'first',
                    activePromptTitle: 'Choose the status token to overwrite',
                    mode: TargetMode.Token,
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        card !== (context.tokens.first as StatusToken[])[0].card &&
                        !card.hasStatusToken((context.tokens.first as StatusToken[])[0].grantedStatus),
                    tokenCondition: (token, context) => token.grantedStatus !== (context?.tokens.first as StatusToken[])?.[0]?.grantedStatus,
                    gameAction: AbilityDsl.actions.handler({
                        handler: (context) => {
                            const targetToken = (context.tokens.second as StatusToken[])[0];
                            const newStatus = (context.tokens.first as StatusToken[])[0].grantedStatus;
                            const targetCard = targetToken.card;
                            if(!targetCard) {
                                return;
                            }
                            targetToken.overrideStatus = newStatus;
                            this.tokensChanged?.push(targetToken);
                            targetCard.updateStatusTokenEffects();
                        }
                    })
                }
            }
        });
    }

    public onConflictFinished() {
        this.tokensChanged?.forEach((token) => {
            const targetCard = token.card;
            token.overrideStatus = undefined;
            if(targetCard) {
                targetCard.updateStatusTokenEffects();
            }
        });
        this.tokensChanged = [];
    }
}
