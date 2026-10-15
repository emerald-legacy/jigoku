import { msg } from '../../GameChat.js';
import { CardType, Duration } from '../../Constants.js';
import { treatStatusTokenAs } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class DiscipleOfDeception extends DrawCard {
    static id = 'disciple-of-deception';

    public override setupCardAbilities() {
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
            })
            .cardLastingEffect((context) => ({
                target: context.tokens.second[0].card ?? undefined,
                duration: Duration.UntilEndOfConflict,
                effect: treatStatusTokenAs(context.tokens.second[0], context.tokens.first[0].grantedStatus)
            }))
            .chatText((context) => msg`replace ${context.tokens.second[0].card}'s ${context.tokens.second} with ${context.tokens.first} until the end of the conflict`);
    }
}
