import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { cardCannot, modifyMilitarySkill } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import { Location, RestrictionType, Trait } from '../../Constants.js';

class AkodoToshiro extends DrawCard {
    static id = 'akodo-toshiro';

    override setupCardAbilities() {
        this.action('Gain +5/+0 and provinces can\'t be broken')
            .condition((context) => context.source.isAttacking())
            .cardLastingEffect(() => ({
                target: this.game.provinceCards,
                targetLocation: Location.Provinces,
                effect: cardCannot(RestrictionType.Break)
            }))
            .cardLastingEffect((context) => ({
                target: context.source,
                effect: modifyMilitarySkill(5)
            }))
            .atEndOfConflict((context) => ({
                target: context.source,
                onlyIf: () => !context.player.cardsInPlay.some((card) => card.hasTrait(Trait.Commander)),
                message: () => msg`${context.source} is discarded due to his delayed effect`,
                gameAction: discardFromPlay()
            }))
            .chatText('gain +5/+0 - provinces cannot be broken during this conflict');
    }
}


export default AkodoToshiro;
