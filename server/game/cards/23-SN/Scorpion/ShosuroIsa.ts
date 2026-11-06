import { msg } from '../../../GameChat.js';
import { Players, Duration, Location, Trait } from '../../../Constants.js';
import { addTrait, removeFromGameInsteadOfLeavingPlay, setBaseMilitarySkill, setBasePoliticalSkill } from '../../../effects.js';
import { putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class ShosuroIsa extends DrawCard {
    static id = 'shosuro-isa';

    override setupCardAbilities() {
        this.action('Manifest a shadow')
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => !card.isUnique()
            }, putIntoPlay())
            .chatText('manifest a shadow of {0}')
            .afterwardsIf((context) => context.target.location === Location.PlayArea)
            .cardLastingEffect((context) => ({
                target: context.target,
                duration: Duration.Custom,
                until: {
                    onCardLeavesPlay: (event) => event.card === context.target
                },
                effect: [
                    setBaseMilitarySkill(0),
                    setBasePoliticalSkill(0),
                    addTrait(Trait.Shadow),
                    removeFromGameInsteadOfLeavingPlay({
                        message: (card) => msg`${card} fades into nothingness and is removed from the game due to leaving play`
                    })
                ]
            }));
    }
}
