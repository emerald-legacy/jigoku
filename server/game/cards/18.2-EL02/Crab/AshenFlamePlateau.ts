import { ProvinceCard } from '../../../ProvinceCard.js';
import { cardCannot } from '../../../effects.js';
import { msg } from '../../../GameChat.js';
import { CardType, Players, RestrictionType, RestrictionScope } from '../../../Constants.js';

export default class AshenFlamePlateau extends ProvinceCard {
    static id = 'ashen-flame-plateau';

    override setupCardAbilities() {
        this.reaction('Prevent opponent from triggering character abilities')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .conflictLastingEffect({
                targetController: Players.Opponent,
                match: (card) => card.type === CardType.Character,
                effect: [
                    cardCannot({
                        cannot: RestrictionType.TriggerAbilities,
                        appliesTo: RestrictionScope.NonForcedAbilities
                    }),
                    cardCannot({
                        cannot: RestrictionType.InitiateKeywords,
                        appliesTo: RestrictionScope.KeywordAbilities
                    })
                ]
            })
            .chatText((context) => msg`prevent ${context.player.opponent} from triggering character abilities this conflict`);
    }
}
