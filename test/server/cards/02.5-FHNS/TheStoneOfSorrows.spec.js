describe('The Stone of Sorrows', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['the-stone-of-sorrows'] }]
                },
                player2: {
                    inPlay: ['tranquil-philosopher']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.philosopher = this.player2.findCardByName('tranquil-philosopher');
            this.game.rings.air.fate = 2;
            this.player1.pass();
        });

        it('stops opponents moving fate from one ring to another', function () {
            const honor = this.player2.honor;
            this.player2.clickCard(this.philosopher);
            this.player2.clickRing('air');
            expect(this.player2).not.toHavePrompt('Choose an unclaimed ring to move fate to');
            expect(this.player2.honor).toBe(honor + 1);
            expect(this.game.rings.air.fate).toBe(2);
            expect(this.game.rings.fire.fate).toBe(0);
        });

        it('doesn\'t stop them while the attached character is bowed', function () {
            this.whisperer.bowed = true;
            this.player2.clickCard(this.philosopher);
            this.player2.clickRing('air');
            this.player2.clickRing('fire');
            expect(this.game.rings.air.fate).toBe(1);
            expect(this.game.rings.fire.fate).toBe(1);
        });
    });
});

describe('The Stone of Sorrows and the contested ring', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['kaiu-envoy']
                },
                player2: {
                    inPlay: [{ card: 'doji-whisperer', attachments: ['the-stone-of-sorrows'] }]
                }
            });
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.game.rings.water.fate = 2;
            this.noMoreActions();
            this.initiateConflict({
                ring: 'water',
                attackers: [this.envoy],
                defenders: []
            });
        });

        it('the attacker takes no fate from the contested ring at declaration (ruling #161)', function () {
            expect(this.game.currentConflict.ring.element).toBe('water');
            expect(this.game.rings.water.fate).toBe(2);
            expect(this.player1.fate).toBe(5);
        });

        it('the attacker takes no fate from the ring once the attached character is bowed or on claiming it (ruling #161)', function () {
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Water Ring');
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.game.rings.water.claimedBy).toBe('player1');
            expect(this.game.rings.water.fate).toBe(2);
            expect(this.player1.fate).toBe(5);
        });
    });
});
