import { msg } from '../../GameChat.js';
import { CardType, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import type { StatusToken } from '../../StatusToken.js';
import { handler } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class DiscipleOfDeception extends DrawCard {
    static id = 'disciple-of-deception';

    private tokensChanged: StatusToken[] = [];

    public setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.OnConflictFinished]: () => this.onConflictFinished()
        });

        this.action('Treat a status token as a different token')
            .condition((context) => context.game.isDuringConflict())
            .tokenTarget({
                name: 'first',
                activePromptTitle: 'Choose the status token to copy',
                cardType: CardType.Character
            })
            .tokenTarget({
                name: 'second',
                dependsOn: 'first',
                activePromptTitle: 'Choose the status token to overwrite',
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== context.tokens.first[0].card &&
                        !card.hasStatusToken(context.tokens.first[0].grantedStatus),
                tokenCondition: (token, context) => token.grantedStatus !== context.tokens.first[0].grantedStatus
            }, handler({
                handler: (context) => {
                    const targetToken = context.tokens.second[0];
                    const newStatus = context.tokens.first[0].grantedStatus;
                    const targetCard = targetToken.card;
                    if(!targetCard) {
                        return;
                    }
                    targetToken.overrideStatus = newStatus;
                    this.tokensChanged.push(targetToken);
                    targetCard.updateStatusTokenEffects();
                }
            }))
            .chatText((context) => msg`replace ${context.tokens.second[0].card}'s ${context.tokens.second} with ${context.tokens.first} until the end of the conflict`);
    }

    public onConflictFinished() {
        this.tokensChanged.forEach((token) => {
            const targetCard = token.card;
            token.overrideStatus = undefined;
            if(targetCard) {
                targetCard.updateStatusTokenEffects();
            }
        });
        this.tokensChanged = [];
    }
}
