import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { bow, selectCard } from '../../GameActions/GameActions.js';

class IdeRyoma extends DrawCard {
    static id = 'ide-ryoma';

    override setupCardAbilities() {
        this.action('Choose one character to bow and one to ready')
            .condition((context) => context.source.isParticipating())
            .target({
                name: 'unicorn',
                activePromptTitle: 'Choose a unicorn character',
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('unicorn')
            })
            .target({
                name: 'nonunicorn',
                activePromptTitle: 'Choose a non-unicorn character',
                dependsOn: 'unicorn',
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    !card.isFaction('unicorn') &&
                        card.controller === context.targets.unicorn.controller
            }, selectCard((context) => ({
                activePromptTitle: 'Choose a character to bow',
                cardCondition: (card) => Object.values(context.targets).includes(card),
                message: (_context, cards, player) => msg`${player} chooses to bow ${cards}`,
                gameAction: bow()
            })))
            .chatText((context) => msg`bow one of ${context.targets.unicorn} and ${context.targets.nonunicorn} and ready the other`)
            .then()
            .ready((context) => ({
                target: [context.targets.unicorn, context.targets.nonunicorn].filter((card) => context.previousEvents.every((event) => !('card' in event) || event.card !== card))
            }));
    }
}


export default IdeRyoma;
