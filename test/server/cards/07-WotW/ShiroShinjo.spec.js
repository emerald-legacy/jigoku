describe('Shiro Shinjo', function() {
    integration(function() {
        describe('Shiro Shinjo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        stronghold: 'shiro-shinjo'
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.shiroShinjo = this.player1.findCardByName('shiro-shinjo');

                const provinces = this.player2.provinces;
                provinces['province 1'].provinceCard.facedown = false;
                provinces['province 2'].provinceCard.facedown = false;
                provinces['province 3'].provinceCard.facedown = false;
            });

            it('should trigger when you collect fate in the dynasty phase', function() {
                this.flow.keepDynasty();
                this.flow.keepConflict();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shiroShinjo);
            });

            it('should bow the stronghold', function() {
                this.flow.keepDynasty();
                this.flow.keepConflict();
                this.player1.clickCard(this.shiroShinjo);
                expect(this.shiroShinjo.bowed).toBe(true);
            });

            it('should give the player fate equal to the number of faceup provinces your opponent controls', function() {
                const fate = this.player1.player.fate;
                this.flow.keepDynasty();
                this.flow.keepConflict();
                this.player1.clickCard(this.shiroShinjo);
                expect(this.player1.player.fate).toBe(fate + 6 + 3);
            });
        });

        describe('Shiro Shinjo\'s ability with broken provinces and passing first', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'setup',
                    player1: {
                        stronghold: 'shiro-shinjo'
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.shiroShinjo = this.player1.findCardByName('shiro-shinjo');

                const provinces = this.player2.provinces;
                this.brokenProvince = provinces['province 1'].provinceCard;
                this.brokenProvince.facedown = false;
                this.brokenProvince.isBroken = true;
                provinces['province 2'].provinceCard.facedown = false;
            });

            it('counts a broken province (ruling #523)', function() {
                expect(this.player1.player.fate).toBe(0);
                this.flow.keepDynasty();
                this.flow.keepConflict();
                expect(this.brokenProvince.isBroken).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.shiroShinjo);
                expect(this.player1.player.fate).toBe(8);
            });

            it('does not trigger on the fate for passing first in the dynasty phase (ruling #522)', function() {
                this.flow.keepDynasty();
                this.flow.keepConflict();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Play cards from provinces');
                expect(this.player1.player.fate).toBe(6);
                this.player1.pass();
                expect(this.getChatLogs(3)).toContain('player1 is the first to pass, and gains 1 fate');
                expect(this.player1.player.fate).toBe(7);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Play cards from provinces');
                expect(this.shiroShinjo.bowed).toBe(false);
            });
        });
    });
});
