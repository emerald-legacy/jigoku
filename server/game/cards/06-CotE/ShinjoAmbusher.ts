import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoAmbusher extends DrawCard {
    static id = 'shinjo-ambusher';

    setupCardAbilities() {
        this.reaction({
            title: 'Disable a province',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            },
            effect: 'prevent an attacked province from triggering its abilities this conflict',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                message: '{0} prevents {1} from triggering its abilities',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.cardCannot('triggerAbilities')
                }))
            }))
        });
    }
}


export default ShinjoAmbusher;
