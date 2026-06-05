import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, CardType, CharacterStatus } from '../../Constants.js';
import { StatusToken } from '../../StatusToken.js';

class AGameOfLetters extends DrawCard {
    static id = 'a-game-of-letters';

    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.isDuringConflict('political'),
            targets: {
                token: {
                    activePromptTitle: 'Choose a token',
                    cardType: CardType.Character,
                    mode: TargetMode.Token,
                    tokenCondition: token => token.grantedStatus === CharacterStatus.Honored || token.grantedStatus === CharacterStatus.Dishonored
                },
                character: {
                    activePromptTitle: 'Choose a character',
                    dependsOn: 'token',
                    cardType: CardType.Character,
                    cardCondition: (card, context) => card.controller !== (context.tokens.token as StatusToken[])[0].card?.controller && card.isParticipating(),
                    gameAction: AbilityDsl.actions.conditional({
                        condition: context => (context.tokens.token as StatusToken[])[0].grantedStatus === CharacterStatus.Honored,
                        trueGameAction: AbilityDsl.actions.honor(),
                        falseGameAction: AbilityDsl.actions.dishonor()
                    })
                }
            }
        });
    }
}


export default AGameOfLetters;
