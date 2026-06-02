import { CardType, Duration, Location, Players } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function skillBonus(card: DrawCard) {
    return card.getMilitarySkill();
}

export default class MotoOktai extends DrawCard {
    static id = 'moto-oktai';

    setupCardAbilities() {
        this.interrupt({
            title: 'Increase this character\'s skill',
            when: {
                onCardLeavesPlay: ({ card }, _context) =>
                    card.location === Location.PlayArea && card.type === CardType.Character
            },
            effect: 'get +{1} {2} for this phase - he is emboldened by justice, but unburdened by mercy!',
            effectArgs: (context) => [skillBonus(context.event.card as DrawCard), 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.modifyMilitarySkill(skillBonus((context as TriggeredAbilityContext).event.card as DrawCard))
            }))
        });

        this.action<DrawCard>({
            title: 'Discard a character from play',
            condition: (context) => context.source.isParticipatingFor(context.player),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            effect: 'discard {1} - purge the weak!',
            effectArgs: (context) => [context.target ?? '']
        });
    }
}
