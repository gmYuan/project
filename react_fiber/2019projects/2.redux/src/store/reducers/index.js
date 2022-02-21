import {combineReducers} from '../../redux';
import counter1 from './counter1';
import counter2 from './counter2';
export default combineReducers({
  counter1,
  counter2
});

/**
{
    counter1:{number:0},
    counter2:{number:0}
}
 */