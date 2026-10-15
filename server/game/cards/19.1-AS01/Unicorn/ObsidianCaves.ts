import { CardType, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { sendHome } from '../../../GameActions/GameActions.js';

export default class ObsidianCaves extends ProvinceCard {
    static id = 'obsidian-caves';

    public setupCardAbilities() {
        this.action('Attacker moves a character home')
            .target({
                cardType: CardType.Character,
                controller: (context) => (context.player.isAttackingPlayer() ? Players.Self : Players.Opponent),
                player: (context) => (context.player.isAttackingPlayer() ? Players.Self : Players.Opponent),
                activePromptTitle: 'Choose a character to send home',
                cardCondition: (card) => card.isAttacking()
            }, sendHome());
    }
}
