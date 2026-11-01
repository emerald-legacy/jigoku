describe('Volcanic Troll', function() {
    integration(function() {
        describe('Volcanic Troll\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1:{
                        inPlay: ['volcanic-troll']
                    }
                });
                this.volcanicTroll = this.player1.findCardByName('volcanic-troll');
            });

            it('should lose it\'s bonus during a fire conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['volcanic-troll'],
                    ring:'fire'
                });
                expect(this.volcanicTroll.militarySkill).toBe(3);
                expect(this.volcanicTroll.politicalSkill).toBe(3);
            });

            it('should be active while fire is unclaimed', function() {
                expect(this.volcanicTroll.militarySkill).toBe(5);
                expect(this.volcanicTroll.politicalSkill).toBe(5);
            });
        });
    });
});

describe('Volcanic Troll with the Fire ring claimed', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['volcanic-troll'],
                    rings: ['fire']
                }
            });
            this.volcanicTroll = this.player1.findCardByName('volcanic-troll');
        });

        it('should not get the bonus', function() {
            expect(this.game.rings.fire.claimedBy).toBe('player1');
            expect(this.volcanicTroll.militarySkill).toBe(3);
            expect(this.volcanicTroll.politicalSkill).toBe(3);
        });
    });
});

describe('Volcanic Troll attachments', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['volcanic-troll', 'doji-whisperer'],
                    hand: ['ornate-fan', 'fine-katana']
                }
            });
            this.volcanicTroll = this.player1.findCardByName('volcanic-troll');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('cannot get a non-Weapon attachment', function() {
            this.player1.clickCard(this.fan);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.volcanicTroll);
        });

        it('can get a Weapon attachment', function() {
            this.player1.clickCard(this.katana);
            expect(this.player1).toBeAbleToSelect(this.volcanicTroll);
            this.player1.clickCard(this.volcanicTroll);
            expect(this.volcanicTroll.attachments).toContain(this.katana);
        });
    });
});
