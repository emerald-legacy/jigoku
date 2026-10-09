import { resolveChoosingPlayer } from '../../../build/server/game/GameActions/resolveChoosingPlayer.js';
import { Players } from '../../../build/server/game/Constants.js';

describe('resolveChoosingPlayer', function() {
    beforeEach(function() {
        this.opponent = { name: 'opponent' };
        this.player = { name: 'player', opponent: this.opponent };
        this.override = { name: 'override' };
        this.context = { player: this.player };
    });

    it('is the player of the ability by default', function() {
        expect(resolveChoosingPlayer(this.context, undefined)).toBe(this.player);
        expect(resolveChoosingPlayer(this.context, Players.Self)).toBe(this.player);
    });

    it('is the opponent for Players.Opponent', function() {
        expect(resolveChoosingPlayer(this.context, Players.Opponent)).toBe(this.opponent);
    });

    it('is the choosing-player override for a choice of targets only', function() {
        this.context.choosingPlayerOverride = this.override;
        expect(resolveChoosingPlayer(this.context, Players.Self, true)).toBe(this.override);
        expect(resolveChoosingPlayer(this.context, Players.Self)).toBe(this.player);
    });

    it('is nobody when the opponent should choose and there is none', function() {
        this.player.opponent = undefined;
        this.context.choosingPlayerOverride = this.override;
        expect(resolveChoosingPlayer(this.context, Players.Opponent, true)).toBeUndefined();
    });
});
