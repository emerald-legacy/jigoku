import DrawCard from '../../DrawCard.js';
import { Duration, Players } from '../../Constants.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { takeControl } from '../../effects.js';
import { loseFate, optional, placeFate } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class MercenaryCompany extends DrawCard {
    static id = 'mercenary-company';

    setupCardAbilities() {
        this.forcedReaction('Give control of this character')
            .when({
                afterConflict: (event, context) => !!context.player.opponent && event.conflict.loser === context.player && context.source.isParticipating()
                    && loseFate().canAffect(context.player.opponent, context)
                    && placeFate().canAffect(context.source, context)
            })
            .gameAction(optional((context) => ({
                player: Players.Opponent,
                prompt: 'Place a fate on Mercenary Company to take control of it?',
                gameAction: placeFate({ origin: context.player.opponent }),
                declineMessage: (context, chooser) => msg`${chooser} chooses not to hire ${context.source}`
            })))
            .chatText((context) => msg`let ${context.player.opponent} hire their services`)
            .limit(unlimitedPerConflict())
            // "If they do": only once the fate is really placed
            .then()
            .cardLastingEffect((context) => ({
                duration: Duration.Custom,
                effect: takeControl(context.player.opponent)
            }))
            .message((context) => msg`${context.player.opponent} places a fate on and takes control of ${context.source}`);
    }

}


export default MercenaryCompany;
