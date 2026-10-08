import { msg } from '../../../GameChat.js';
import { discardStatusToken } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class WebisusBlessing extends DrawCard {
    static id = 'webisu-s-blessing';

    setupCardAbilities() {
        this.action('Discard status tokens')
            .tokenTarget({
                name: 'first',
                activePromptTitle: 'Choose a status token'
            }, discardStatusToken())
            .tokenTarget({
                name: 'second',
                activePromptTitle: 'Choose a status token',
                dependsOn: 'first',
                optional: true,
                tokenCondition: (token, context) => token !== context.tokens.first[0]
            }, discardStatusToken())
            .chatText((context) => context.tokens.second
                ? msg`discard ${context.tokens.first[0].card}'s ${context.tokens.first} and ${context.tokens.second[0].card}${'\'s '}${context.tokens.second}`
                : msg`discard ${context.tokens.first[0].card}'s ${context.tokens.first}`);
    }
}
