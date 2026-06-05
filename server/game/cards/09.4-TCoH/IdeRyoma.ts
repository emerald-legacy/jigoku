import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type { Event } from '../../Events/Event.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeRyoma extends DrawCard {
    static id = 'ide-ryoma';

    setupCardAbilities() {
        this.action({
            title: 'Choose one character to bow and one to ready',
            condition: (context) => context.source.isParticipating(),
            targets: {
                unicorn: {
                    activePromptTitle: 'Choose a unicorn character',
                    cardType: CardType.Character,
                    cardCondition: card => card.isFaction('unicorn')
                },
                nonunicorn: {
                    activePromptTitle: 'Choose a non-unicorn character',
                    dependsOn: 'unicorn',
                    cardType: CardType.Character,
                    cardCondition: (card, context) =>
                        !card.isFaction('unicorn') &&
                        card.controller === context.targets.unicorn.controller,
                    gameAction: AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a character to bow',
                        cardCondition: card => Object.values(context.targets).includes(card),
                        gameAction: AbilityDsl.actions.bow()
                    }))
                }
            },
            then: (context: AbilityContext) => ({
                gameAction: AbilityDsl.actions.ready(() => ({
                    target: (Object.values(context.targets) as BaseCard[]).filter((card: BaseCard) => context.events.every((event: Event) => (event as Event & { card?: BaseCard }).card !== card))
                }))
            })
        });
    }
}


export default IdeRyoma;
