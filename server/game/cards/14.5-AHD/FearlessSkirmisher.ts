import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CharacterStatus, CardType } from '../../Constants.js';

class FearlessSkirmisher extends DrawCard {
    static id = 'fearless-skirmisher';

    setupCardAbilities() {
        this.reaction('Move a dishonored status token')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    event.conflict.conflictType === 'military'
            })
            .tokenTarget('token', {
                activePromptTitle: 'Choose a dishonored token',
                location: Location.Any,
                tokenCondition: (token) => {
                    return token.grantedStatus === CharacterStatus.Dishonored;
                }
            })
            .target('character', {
                activePromptTitle: 'Choose a character to receive the token',
                dependsOn: 'token',
                cardType: CardType.Character
            }, AbilityDsl.actions.moveStatusToken((context) => ({
                target: context.tokens.token,
                recipient: context.targets.character
            })));
    }
}


export default FearlessSkirmisher;
